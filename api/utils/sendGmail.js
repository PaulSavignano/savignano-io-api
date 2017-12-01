import nodemailer from 'nodemailer'

import ApiConfig from '../models/ApiConfig'
import Brand from '../models/Brand'
import getRgbTotal from '../utils/getRgbTotal'

const sendGmail = async ({
  to,
  toSubject,
  toBody,
  fromSubject,
  fromBody,
  brandName
}) => {
  try {
    const apiConfig = await ApiConfig.findOne({ brandName })
    if (!apiConfig) throw 'Email not sent, no apiConfig was found'
    const {
      gmailUser,
      oauthAccessToken,
      oauthClientId,
      oauthClientSecret,
      oauthRefreshToken
    } = apiConfig.values
    const brand = await Brand.findOne({ brandName })
    if (!brand) throw 'Email not sent, no brand was found'
    const {
      appBar: {
        values: {
          color: appBarColor,
          fontFamily,
          fontSize,
          fontWeight,
          letterSpacing
        }
      },
      business: {
        image,
        values: {
          name,
          phone,
          email,
          street,
          city,
          state,
          zip
        }
      },
      palette: {
        values: { primary1Color }
      },
      typography: {
        values: {
          fontFamily: textFont
        }
      }
    } = brand
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: 'OAuth2',
        user: gmailUser,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        refreshToken: oauthRefreshToken,
        accessToken: oauthAccessToken
      }
    })
    const color = getRgbTotal(appBarColor) > 600 ? primary1Color : appBarColor
    const emailTemplate = (body) => (`
      <!doctype html>
      <html>
      <head>
        <link href="https://fonts.googleapis.com/css?family=Dancing+Script|Open+Sans+Condensed:300" rel="stylesheet">
      <style type="text/css">
        p, div, ol {
          font-family: ${textFont};
        }
        a {
          text-decoration: none;
          color: inherit;
          font-family: ${textFont};
        }
      </style>
      </head>
      <body>
         <main>
          ${body}
          <br/><br/>
          <a href=${brandName}>
            ${image && image.src ? `<img src="assets.savignano.io/${image.src}" alt="item" height="64px" width="auto"/>` : ''}
            <div>
              <span
                style="text-decoration: none; color: ${color}; font-family: ${fontFamily}; font-size: ${fontSize}; font-weight: ${fontWeight}; letter-spacing: ${letterSpacing};"
              >
                ${name}
              </span>
            </div>
          </a>
          <div>
            <a
              href="mailto:${gmailUser}"
              style="text-decoration: none; color: ${primary1Color};"
              >
              ${gmailUser}
            </a>
          </div>
          ${phone ? `
            <div style="font-family: ${textFont}">
              <a href="tel:${phone.replace(/\D+/g, '')}" style="text-decoration: none; color: inherit;">
                ${phone}
              </div>
          ` : '' }
          ${street ? `<div style="font-family: ${textFont}">${street}</div>` : '' }
          ${zip ? `<div style="font-family: ${textFont}">${city} ${state}, ${zip}</div>` : '' }
         </main>
      </body>
      </html>
    `)

    const userMail = {
      from: gmailUser,
      to: to,
      subject: toSubject,
      html: emailTemplate(toBody)
    }
    if (fromSubject) {
      const adminMail = {
        from: gmailUser,
        to: gmailUser,
        subject: fromSubject,
        html: emailTemplate(fromBody)
      }
      const adminMailInfo = await transporter.sendMail(adminMail)
      if (!adminMailInfo) throw 'Admin email did not send'
      console.info('sendGmail adminMailInfo: ', adminMailInfo)
    }
    const userMailInfo = await transporter.sendMail(userMail)
    if (!userMailInfo) throw 'User email did not send'
    console.info('sendGmail userMailInfo: ', userMailInfo)
    return userMailInfo
  } catch (error) {
    return Promise.reject(error)
  }
}

export default sendGmail

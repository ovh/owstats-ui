const inquirer = require('inquirer')

// prompt user to provide its location
exports.location = () => {
  const question = inquirer.prompt([
    {
      type: 'list',
      name: 'location',
      message: 'You are about to deploy a custom version of OVHcloud Web Statistics as a standalone website. It will display logs data associated to an OVHcloud webhosting. Where is located your web hosting ?',
      choices: ['OVH Europe', 'OVH North-America']
    }

  ])
  return question
}

// prompt user to provide its credentials
exports.appCredentials = (countryCode) => {
  const question = inquirer.prompt([
    {
      name: 'applicationKey',
      message: `What is your APPLICATION KEY ? If you do not have application credentials yet, please create one at : https://${countryCode}.api.ovh.com/createToken/ (set validity to "unlimited" and rights to "GET" and "/hosting/web*". You can choose freely script name and script description values)`
    },
    {
      type: 'password',
      name: 'applicationSecret',
      message: 'What is your APPLICATION SECRET ?'
    },
    {
      type: 'password',
      name: 'consumerKey',
      message: 'What is your CONSUMER KEY ?'
    }
  ])

  return question
}

// prompt user to choose hosting
exports.hostingChoice = (hostingList) => {
  const question = inquirer.prompt([
    {
      type: 'list',
      name: 'hosting',
      message: 'Which OVHcloud web hosting data do you want to display on your custom Web Statistics site ?',
      choices: hostingList
    }
  ])

  return question
}

// prompt user to choose deployment method
exports.deployMethodChoice = () => {
  const question = inquirer.prompt([
    {
      type: 'list',
      name: 'deployMethodChoice',
      message: 'Do you want your custom Web Statistics site to be published at an URL associated to your OVHcloud web hosting or at another URL ? If you are unsure, select OVHcloud Web hosting, deployment will be much easier.',
      choices: ['OVHcloud Webhosting', 'Other server']
    }
  ])

  return question
}

// prompt user to choose domain
exports.attachedDomainChoice = (attachedDomainList, hosting) => {
  const question = inquirer.prompt([
    {
      type: 'list',
      name: 'attachedDomain',
      message: `On which domain name do you want your custom Web Statistics site to be published ? Be aware that this choice will affect only the url of your custom Web Statistics site. Data displayed will be computed from all logs present on web hosting: ${hosting}`,
      choices: attachedDomainList.sort()
    }
  ])

  return question
}

// prompt user to provide credentials
exports.connectionCredentials = (defaultUser) => {
  const question = inquirer.prompt([
    {
      name: 'user',
      message: 'What is your OVHcloud web hosting\'s storage space login ? See https://docs.ovh.com/ie/en/hosting/log-in-to-storage-ftp-web-hosting/ if you are unsure',
      default: defaultUser
    },
    {
      type: 'password',
      name: 'password',
      message: 'What is your OVHcloud web hosting\'s storage space password ?'
    }
  ])

  return question
}

// prompt user to continue upload even if only ftp connection available
exports.continueUpload = () => {
  const question = inquirer.prompt([
    {
      type: 'confirm',
      name: 'continueUpload',
      message: 'Your user has only FTP connection available. It is recommended to activate SFTP for security reasons. Do you want to continue anyway ?'
    }
  ])

  return question
}

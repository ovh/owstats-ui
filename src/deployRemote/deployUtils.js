/// //                        /////
/// //   APIv6 information    /////
/// //                        /////

exports.getLocationInfo = (location) => {
  let endpoint
  let countryCode
  if (location === 'OVH Europe') {
    endpoint = 'ovh-eu'
    countryCode = 'eu'
  } else {
    endpoint = 'ovh-ca'
    countryCode = 'ca'
  }

  return {
    endpoint, countryCode
  }
}

exports.getHostingList = async (ovh) => {
  let hostingList
  try {
    hostingList = await ovh.requestPromised('GET', '/hosting/web')
  } catch (e) {
    console.log('An error occured while retrieving your web hostings. Please check your credentials.')
    console.log(e)
    process.exit(1)
  }

  if (hostingList.length === 0) {
    console.log('No web hosting is associated with the credentials provided. Please check your credentials.')
    process.exit(1)
  } else {
    return hostingList
  }
}

exports.getHostingInfo = async (ovh, hosting) => {
  try {
    const hostingInfo = await ovh.requestPromised('GET', `/hosting/web/${hosting}`)
    return hostingInfo
  } catch (e) {
    console.log('An error occured while retrieving information related to your web hosting.')
    console.log(e)
    process.exit(1)
  }
}

exports.getAttachedDomainList = async (ovh, hostingList) => {
  const attachedDomainList = []
  try {
    for (const hosting of hostingList) {
      const attachedDomainHosting = await ovh.requestPromised('GET', `/hosting/web/${hosting}/attachedDomain`)
      attachedDomainHosting.forEach(domain => attachedDomainList.push(domain))
    }
  } catch (e) {
    console.log('An error occured while retrieving your domain names.')
    console.log(e)
    process.exit(1)
  }

  if (attachedDomainList.length === 0) {
    console.log('No domain name is attached to your web hostings. To deploy custom Web Statistics site, you need a domain name.')
    process.exit(1)
  } else {
    return attachedDomainList
  }
}

exports.getHostingDomain = async (ovh, attachedDomain) => {
  try {
    const hostingDomain = await ovh.requestPromised('GET', '/hosting/web/attachedDomain', {
      domain: attachedDomain
    })
    return hostingDomain
  } catch (e) {
    console.log('An error occured while retrieving information related to your domain name.')
    console.log(e)
    process.exit(1)
  }
}

exports.getDomainInfo = async (ovh, hostingDomain, attachedDomain) => {
  try {
    const attachedDomainInfo = await ovh.requestPromised('GET', `/hosting/web/${hostingDomain}/attachedDomain/${attachedDomain}`)
    return attachedDomainInfo
  } catch (e) {
    console.log('An error occured while retrieving information related to your domain name.')
    console.log(e)
    process.exit(1)
  }
}

exports.getUserInfo = async (ovh, hosting, user) => {
  // get user info
  try {
    const userInfo = await ovh.requestPromised('GET', `/hosting/web/${hosting}/user/${user}`)
    return userInfo
  } catch (e) {
    console.log('An error occured while retrieving information related to your user. Please check your login')
    console.log(e)
    process.exit(1)
  }
}

/// //                        /////
/// //   Build application    /////
/// //                        /////

exports.isNodeInstalled = async () => {
  let nodeVersion
  try {
    const nodeVersionComplete = await execShellCommand('node --version')
    nodeVersion = nodeVersionComplete.split('.')[0]
  } catch (e) {
    console.log('It seems that Node.js is not installed on your machine. Please install Node.js v12, v14 or v16 to install dependencies and build Vue.js application')
    console.log(e)
    process.exit(1)
  }

  if (!['v12', 'v14', 'v16'].includes(nodeVersion)) {
    console.log(`Node.js version installed on your machine is ${nodeVersion}. Please install v12, v14 or v16 instead to install dependencies and build Vue.js application`)
    process.exit(1)
  } else {
    return true
  }
}

exports.installPackages = async () => {
  try {
    console.log('Dependencies installation started. It might take up to a few minutes')
    await execShellCommand('yarn install')
    console.log('Dependencies installation succeeded\n')
  } catch (e) {
    console.log('Dependencies installation failed')
    console.log(e)
    process.exit(1)
  }
}

exports.updateEnvFile = async (hosting, logsBaseUrl) => {
  const fs = require('fs').promises
  const uploadObjectsNames = getUploadObjectsNames(hosting)

  let s = 'VUE_APP_TARGET_REMOTE_API=true\n'
  s += `VUE_APP_LOGIN_LOCATION=/${uploadObjectsNames.loginOwstats}\n`
  s += `VUE_APP_PUBLIC_PATH=/${hosting}/owstats/\n`
  s += `VUE_APP_API_BASE_URL=${logsBaseUrl}/\n`

  try {
    await fs.writeFile('.env', s)
    console.log('Vue.js app .env file updated')
  } catch (e) {
    console.log(e)
  }
}

exports.buildApplication = async () => {
  try {
    console.log('Application build started. It might take up to a few minutes')
    await execShellCommand('yarn build')
    console.log('Application build succeeded\n')
  } catch (e) {
    console.log('Application build failed')
    console.log(e)
    process.exit(1)
  }
}

/// //                          /////
/// // UPLOAD FILES TO HOSTING  /////
/// //                          /////

const closeConnection = (protocol, client) => {
  if (protocol === 'ftp') {
    client.close()
  } else {
    client.end()
  }
}

const clientConnection = async (protocol, host, port, user, password) => {
  let client
  const ftp = require('basic-ftp')
  const SftpClient = require('ssh2-sftp-client')

  if (protocol === 'ftp') {
    client = new ftp.Client()
    client.ftp.verbose = false
    client.trackProgress(info => {
      console.log('File uploaded: ', info.name)
    })
  } else {
    client = new SftpClient()
  }

  try {
    if (protocol === 'ftp') {
      await client.access({
        host: host,
        port: port,
        user: user,
        password: password
      })
    } else {
      await client.connect({
        host: host,
        port: port,
        user: user,
        password: password
      })
    }
    return client
  } catch (e) {
    console.log('We could not connect to your web hosting. Please check your credentials')
    console.log(e)
    closeConnection(protocol, client)
    process.exit(1)
  }
}

const uploadDir = async (protocol, client, localDir, remoteDir) => {
  try {
    if (protocol === 'ftp') {
      await client.uploadFromDir(localDir, remoteDir)
    } else {
      await client.uploadDir(localDir, remoteDir)
    }
    console.log(`${localDir} folder content uploaded to ${remoteDir}`)
  } catch (e) {
    console.log(`We could not upload ${localDir} folder to your web hosting. ${localDir} folder is the folder built after "yarn build" command. Please check the folder is present in your local`)
    console.log(e)
    closeConnection(protocol, client)
    process.exit(1)
  }
}

const uploadFile = async (protocol, client, localFile, remotePath, fileName) => {
  try {
    if (protocol === 'ftp') {
      await client.uploadFrom(localFile, remotePath)
    } else {
      await client.put(localFile, remotePath)
    }
    console.log(`${fileName} uploaded`)
  } catch (e) {
    console.log(`We could not upload ${fileName} to your web hosting.`)
    console.log(e)
    closeConnection(protocol, client)
    process.exit(1)
  }
}

const cleanDir = async (protocol, client, remoteDir) => {
  try {
    if (protocol === 'ftp') {
      const rootDir = await client.pwd()
      await client.ensureDir(remoteDir)
      await client.clearWorkingDir()
      await client.cd(rootDir)
    } else {
      const isRemoteDirExists = await client.exists(remoteDir)
      if (isRemoteDirExists) {
        await client.rmdir(remoteDir, true)
      }
    }
  } catch (e) {
    console.log(e)
    closeConnection(protocol, client)
    process.exit(1)
  }
}

const getEnvOwstats = (appCredentials, hosting, countryCode, logsBaseUrl) => {
  const Readable = require('stream').Readable
  const envOwstats = new Readable()
  envOwstats.push(`APP_KEY=${appCredentials.applicationKey}\n`)
  envOwstats.push(`APP_SECRET=${appCredentials.applicationSecret}\n`)
  envOwstats.push(`CONSUMER_KEY=${appCredentials.consumerKey}\n`)
  envOwstats.push(`HOSTING=${hosting}\n`)
  envOwstats.push(`ENDPOINT=${countryCode}.api.ovh.com\n`)
  envOwstats.push(`LOGS_BASE_URL=${logsBaseUrl}\n`)
  envOwstats.push(null)

  return envOwstats
}

const getLocationOwstats = (root) => {
  const Readable = require('stream').Readable
  const subFolderNumber = (root.match(/\//g) || []).length

  if (subFolderNumber > 0) {
    const location = new Readable()
    location.push(`${subFolderNumber}`)
    location.push(null)
    return location
  } else {
    return null
  }
}

exports.uploadToHosting = async (protocol, user, password, host, port, hosting, logsBaseUrl, appCredentials, root, countryCode) => {
  console.log('Upload started')

  const client = await clientConnection(protocol, host, port, user, password)
  const uploadObjectsNames = getUploadObjectsNames(hosting)
  // upload dist folder
  const remoteDir = `${root}/${hosting}/owstats`

  // clean owstats folder if exists
  await cleanDir(protocol, client, remoteDir)
  await uploadDir(protocol, client, uploadObjectsNames.dist, remoteDir)

  // upload app credentials
  const envOwstats = getEnvOwstats(appCredentials, hosting, countryCode, logsBaseUrl)
  await uploadFile(protocol, client, envOwstats, uploadObjectsNames.envOwstats, uploadObjectsNames.envOwstats)

  // upload login.php
  await uploadFile(protocol, client, 'login_owstats.php', `${root}/${uploadObjectsNames.loginOwstats}`, uploadObjectsNames.loginOwstats)

  // upload location
  const locationOwstats = getLocationOwstats(root)

  if (locationOwstats) {
    await uploadFile(protocol, client, locationOwstats, `${root}/${uploadObjectsNames.locationOwstats}`, uploadObjectsNames.locationOwstats)
  }

  closeConnection(protocol, client)
}

/// //                          /////
/// //    DEPLOY FOLDER BUILD   /////
/// //                          /////

exports.buildDeployFolder = async (hosting, appCredentials, countryCode, logsBaseUrl) => {
  const platform = require('process').platform
  // get os
  let sep
  if (platform === 'win32') {
    sep = '\\'
  } else {
    sep = '/'
  }

  const uploadObjectsNames = getUploadObjectsNames(hosting)

  // remove deploy folder
  await execShellCommand('rm -rf deploy')

  // create deploy folder and sub folders
  await execShellCommand('mkdir deploy')
  await execShellCommand(`mkdir deploy${sep}root`)
  await execShellCommand(`mkdir deploy${sep}root${sep}${hosting}`)
  await execShellCommand(`mkdir deploy${sep}root${sep}${hosting}${sep}owstats`)

  // .env-owstats
  let s = `APP_KEY=${appCredentials.applicationKey}\n`
  s += `APP_SECRET=${appCredentials.applicationSecret}\n`
  s += `CONSUMER_KEY=${appCredentials.consumerKey}\n`
  s += `HOSTING=${hosting}\n`
  s += `ENDPOINT=${countryCode}.api.ovh.com\n`
  s += `LOGS_BASE_URL=${logsBaseUrl}\n`

  try {
    await execShellCommand(`echo "${s}" > deploy${sep}${uploadObjectsNames.envOwstats}`)
    console.log('Owstats credentials created')
  } catch (e) {
    console.log('Owstats credentials creation failed')
    console.log(e)
    process.exit(1)
  }

  // dist
  await execShellCommand(`cp -a dist${sep}. deploy${sep}root${sep}${hosting}${sep}owstats`)

  // login.php
  await execShellCommand(`cp login_owstats.php deploy${sep}root${sep}${uploadObjectsNames.loginOwstats}`)

  console.log('Folder "deploy" has been created. It contains the files to be deployed on your server. Please check [documentation] for more detailed explanation')
}

/// //                        /////
/// //    OTHER FUNCTIONS     /////
/// //                        /////
exports.getLogsBaseUrl = (cluster) => {
  return `https://logs.${cluster}.hosting.ovh.net`
}

exports.isDeployOnOVH = (deployMethodChoice) => {
  if (deployMethodChoice.deployMethodChoice === 'Other server') {
    return false
  } else {
    return true
  }
}

const getUploadObjectsNames = (hosting) => {
  const dist = 'dist'
  const envOwstats = `.env.owstats__${hosting}`
  const loginOwstats = `login_owstats__${hosting}.php`
  const locationOwstats = `.location.owstats__${hosting}`

  return {
    dist,
    envOwstats,
    loginOwstats,
    locationOwstats
  }
}

exports.deployOvhSuccess = (attachedDomain, hosting) => {
  const address = `https://${attachedDomain}/${hosting}/owstats/#/`
  const managerAddress = `https://www.ovh.com/manager/web/#/hosting/${hosting}/user-logs`
  console.log(`\nProcess is complete. Your custom Web Statistics site is available at the address : ${address}.\n This website is protected by credentials of the section "User administration" of ${managerAddress}`)
  process.exit(0)
}

function execShellCommand (cmd) {
  const exec = require('child_process').exec
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout || stderr)
    })
  })
}

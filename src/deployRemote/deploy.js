const utils = require('./deployUtils')
const questions = require('./deployQuestions')

main()

async function main () {
  /// //                                   /////
  /// // STEP 1: OVH CLOUD API CREDENTIALS /////
  /// //                                   /////

  const location = await questions.location()
  const { endpoint, countryCode } = utils.getLocationInfo(location.location)
  const appCredentials = await questions.appCredentials(countryCode)

  // object to make ovh api calls
  const ovh = require('ovh')({
    endpoint: endpoint,
    appKey: appCredentials.applicationKey,
    appSecret: appCredentials.applicationSecret,
    consumerKey: appCredentials.consumerKey
  })

  /// //                           /////
  /// // STEP 2: HOSTING SELECTION /////
  /// //                           /////

  // get hosting for which data will be displayd by custom web statistics site
  const hostingList = await utils.getHostingList(ovh)
  const hostingChoice = await questions.hostingChoice(hostingList)
  const hosting = hostingChoice.hosting

  const hostingInfo = await utils.getHostingInfo(ovh, hosting)
  const logsBaseUrl = utils.getLogsBaseUrl(hostingInfo.cluster)

  // deploy on ovh webhosting server or other ?
  const deployMethodChoice = await questions.deployMethodChoice()
  const isDeployOnOVH = utils.isDeployOnOVH(deployMethodChoice)

  /// //                           /////
  /// // STEP 3: DOMAIN SELECTION  /////
  /// //                           /////

  let attachedDomainInfo
  let attachedDomain
  let hostingDomain
  let hostingInfoDomain

  if (isDeployOnOVH) {
    // get domain where custom web statistics site will be deployed
    const attachedDomainList = await utils.getAttachedDomainList(ovh, hostingList)
    const attachedDomainChoice = await questions.attachedDomainChoice(attachedDomainList, hosting)
    attachedDomain = attachedDomainChoice.attachedDomain

    hostingDomain = await utils.getHostingDomain(ovh, attachedDomain)
    hostingInfoDomain = await utils.getHostingInfo(ovh, hostingDomain)

    attachedDomainInfo = await utils.getDomainInfo(ovh, hostingDomain, attachedDomain)

    // check credentials are not exposed
    if (!attachedDomainInfo.path || attachedDomainInfo.path === '.') {
      console.log('The root folder of your domain is the root folder of your web hosting. It means that the application credentials you provided would be publicly available after you deploy your custom Web Statistics site. Please change your root folder settings.')
      process.exit(1)
    }
  }

  /// //                                 /////
  /// // STEP 4: BUILD VUEJS APPLICATION /////
  /// //                                 /////

  await utils.isNodeInstalled()
  await utils.installPackages()
  await utils.updateEnvFile(hosting, logsBaseUrl)
  await utils.buildApplication()

  /// //                                     /////
  /// // STEP 5: UPLOAD FILES TO OVH HOSTING /////
  /// //                                     /////

  if (isDeployOnOVH) {
    const connectionCredentials = await questions.connectionCredentials(hostingInfoDomain.primaryLogin)

    const user = connectionCredentials.user
    const password = connectionCredentials.password
    const root = attachedDomainInfo.path
    const userInfo = await utils.getUserInfo(ovh, hostingDomain, user)

    const userState = userInfo.state
    const sshState = userInfo.sshState

    if (userState !== 'rw') {
      console.log('User connection is disabled. Please check your user rights.')
      process.exit(1)
    }

    if (sshState !== 'none') {
      const host = userInfo.serviceManagementCredentials.ftp.url
      const port = userInfo.serviceManagementCredentials.ssh.port
      await utils.uploadToHosting('sftp', user, password, host, port, hosting, logsBaseUrl, appCredentials, root, countryCode)
    } else {
      const continueUpload = await questions.continueUpload()
      if (continueUpload.continueUpload) {
        const host = userInfo.serviceManagementCredentials.ftp.url
        const port = userInfo.serviceManagementCredentials.ftp.port
        await utils.uploadToHosting('ftp', user, password, host, port, hosting, logsBaseUrl, appCredentials, root, countryCode)
      } else {
        process.exit(1)
      }
    }

    utils.deployOvhSuccess(attachedDomain, hosting)
  }

  /// //                                         /////
  /// // BUILD DEPLOY FOLDER FOR NON OVH SERVERS /////
  /// //                                         /////

  if (!isDeployOnOVH) {
    utils.buildDeployFolder(hosting, appCredentials, countryCode, logsBaseUrl)
  }
}

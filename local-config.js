const inquirer = require('inquirer')
const exec = require('child_process').exec

main()

async function main () {
  // review how to generate token in dev mode
  // review the documentation

  /// //                                   /////
  /// // STEP 1: OVH CLOUD API CREDENTIALS /////
  /// //                                   /////

  // prompt user to provide its credentials
  const appEndpoint = await inquirer.prompt([
    {
      type: 'list',
      name: 'endpoint',
      message: 'Your analytics website will display logs data associated to an OVHcloud webhosting. Where is your hosting located ?',
      choices: ['OVH Europe', 'OVH North-America']
    }
  ])

  // OVHcloud APIs endpoint
  let endpoint
  let countryCode
  if (appEndpoint.endpoint === 'OVH Europe') {
    endpoint = 'ovh-eu'
    countryCode = 'eu'
  } else {
    endpoint = 'ovh-ca'
    countryCode = 'ca'
  }

  // prompt user to provide its app credentials
  const appCredentials = await inquirer.prompt([
    {
      name: 'applicationKey',
      message: `What is your application key ? If you do not have application credentials yet, please create one at : https://${countryCode}.api.ovh.com/createToken/ (set validity to "unlimited" and rights to "GET" and "*". You can choose freely script name and script description values)`
    },
    {
      type: 'password',
      name: 'applicationSecret',
      message: 'What is your application secret ?'
    },
    {
      type: 'password',
      name: 'consumerKey',
      message: 'What is your consumer key ?'
    }
  ])

  /// //                           /////
  /// // STEP 2: HOSTING SELECTION /////
  /// //                           /////

  // object to make ovh api calls
  const ovh = require('ovh')({
    endpoint: endpoint,
    appKey: appCredentials.applicationKey,
    appSecret: appCredentials.applicationSecret,
    consumerKey: appCredentials.consumerKey
  })

  // prompt user to select hosting and get hosting info
  let hostingList
  try {
    hostingList = await ovh.requestPromised('GET', '/hosting/web')
  } catch (e) {
    console.log('An error occured while retrieving your hostings. Please check your credentials.')
    console.log(e)
    process.exit(1)
  }

  if (hostingList.length === 0) {
    console.log('No hosting is associated with the credentials provided. Please check your credentials.')
    process.exit(1)
  }

  const hostingChoice = await inquirer.prompt([
    {
      type: 'list',
      name: 'hosting',
      message: 'Which OVHcloud webhosting data do want to use for local development ?',
      choices: hostingList
    }
  ])

  const hosting = hostingChoice.hosting
  let hostingInfo
  try {
    hostingInfo = await ovh.requestPromised('GET', `/hosting/web/${hosting}`)
  } catch (e) {
    console.log('An error occured while retrieving information related to your hosting.')
    console.log(e)
    process.exit(1)
  }

  const logsBaseUrl = `https://logs.${hostingInfo.cluster}.hosting.ovh.net`

  /// //                           /////
  /// // STEP 3: ENV FILE CREATION /////
  /// //                           /////
  // .env-owstats
  let s = `VUE_APP_KEY=${appCredentials.applicationKey}\n`
  s += `VUE_APP_SECRET=${appCredentials.applicationSecret}\n`
  s += `VUE_APP_CONSUMER_KEY=${appCredentials.consumerKey}\n`
  s += `VUE_APP_HOSTING=${hosting}\n`
  s += `VUE_APP_ENDPOINT=${endpoint}\n`
  s += `VUE_APP_API_BASE_URL=${logsBaseUrl}/\n`
  s += 'VUE_APP_TARGET_REMOTE_API=true\n'
  s += 'VUE_APP_PUBLIC_PATH=/'

  try {
    await execShellCommand(`echo "${s}" > .env.development.local`)
    console.log('.env.dev.local created')
  } catch (e) {
    console.log('.env.dev.local creation failed')
    console.log(e)
    process.exit(1)
  }
}
/// //                        /////
/// // SHELL COMMAND FUNCTION /////
/// //                        /////
function execShellCommand (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      }
      resolve(stdout || stderr)
    })
  })
}

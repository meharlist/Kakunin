require('./helpers/prototypes');
const chai = require('chai');
const modulesLoader = require('./helpers/modulesLoader');
const chaiAsPromised = require('chai-as-promised');
const mailTrapClient = require('./emails/mailtrapClient');
chai.use(chaiAsPromised);

const pascalConfig = require('./helpers/pascalConfig');

exports.config = {
  multiCapabilities: [
    {
      'browserName': 'chrome',
      'chromeOptions': {
        prefs: {
          'download': {
            'prompt_for_download': false,
            'default_directory': pascalConfig.projectPath + pascalConfig.downloads,
            'directory_upgrade': true,
          }
        }
      }
    },
  ],

  useAllAngular2AppRoots: pascalConfig.type === 'ng2',

  getPageTimeout: parseInt(pascalConfig.timeout) * 1000,
  allScriptsTimeout: parseInt(pascalConfig.timeout) * 1000,

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: pascalConfig.features.map(file => pascalConfig.projectPath + file + '/**/*.feature'),

  cucumberOpts: {
    require: [
      'configuration/config.js',
      './configuration/hooks.js',
      'step_definitions/**/*.js',
      ...pascalConfig.step_definitions.map(file => pascalConfig.projectPath + file + '/**/*.js'),
      ...pascalConfig.hooks.map(file => pascalConfig.projectPath + file + '/**/*.js')
    ],
    format: 'pretty',
    profile: false,
    'no-source': true
  },

  onPrepare: function () {
    browser.driver.manage().window().setSize(
      parseInt(pascalConfig.browserWidth),
      parseInt(pascalConfig.browserHeight)
    );

    browser.page = modulesLoader.getModulesAsObject(pascalConfig.pages, []);

    global.expect = chai.expect;

    if (pascalConfig.clearEmailInboxBeforeTests) {
      return mailTrapClient.clearInbox();
    }
  },

  baseUrl: pascalConfig.baseUrl
};
const path = require('node:path');

const iosAppName = 'gymflowchallenge';
const iosSimulatorDevice = process.env.DETOX_SIMULATOR_ID
  ? { id: process.env.DETOX_SIMULATOR_ID }
  : process.env.DETOX_SIMULATOR_TYPE
    ? { type: process.env.DETOX_SIMULATOR_TYPE }
  : {
      id: '8458022A-8E39-411A-9F75-9C6B510D425E',
      type: 'iPhone 17 Pro',
      os: 'iOS 26.4',
    };
const iosBuildPath = path.join(
  'ios',
  'build',
  'Build',
  'Products',
  'Release-iphonesimulator',
  `${iosAppName}.app`
);
const iosBuildCommand = [
  'npx expo prebuild --platform ios',
  [
    'xcodebuild',
    `-workspace ios/${iosAppName}.xcworkspace`,
    `-scheme ${iosAppName}`,
    '-configuration Release',
    '-sdk iphonesimulator',
    '-derivedDataPath ios/build',
    'CODE_SIGNING_ALLOWED=NO',
  ].join(' '),
].join(' && ');

/** @type {import('detox').DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: path.join('node_modules', '.bin', 'jest'),
      config: 'e2e/jest.config.js',
      _: ['e2e/users-flow.e2e.js'],
    },
    jest: {
      setupTimeout: 120000,
      teardownTimeout: 120000,
    },
  },
  apps: {
    ios: {
      type: 'ios.app',
      binaryPath: process.env.IOS_DETOX_APP_PATH ?? iosBuildPath,
      build: process.env.IOS_DETOX_BUILD_COMMAND ?? iosBuildCommand,
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: iosSimulatorDevice,
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios',
    },
  },
};

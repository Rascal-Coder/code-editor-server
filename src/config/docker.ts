import { DockerOptions } from 'dockerode';
// import * as os from 'os';

// const isWin = os.platform() === 'win32';

const config: DockerOptions = {
  host: '127.0.0.1',
  port: 2375,
  protocol: 'http',
};

export default config;

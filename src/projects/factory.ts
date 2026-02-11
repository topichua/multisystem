import { bondConfig } from './bond';
import { otaConfig } from './ota';
import { ProjectConfig } from './ProjectConfig';

const project = import.meta.env.VITE_PROJ;

let config: ProjectConfig;

if (project == 'ota') {
  config = otaConfig;
} else {
  config = bondConfig;
}
config = otaConfig;

console.log(config.name);

export default config;

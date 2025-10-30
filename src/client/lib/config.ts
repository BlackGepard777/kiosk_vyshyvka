// 
// Kioks Android app exports Config object with a get method 
// for configurations obtained from the Firebase remote config
type Config = {
  get: (key: string) => string | null;
};

const wdLocal: {[index: string]:Config} = window as any;

const kioskConf: Config = wdLocal['Config'] ?? {
  get: (key: string) => null
};

function boolParam(confKey: string, env: string | null, fallback: Boolean): Boolean {
  if (kioskConf.get(confKey) !== null) {
    return kioskConf.get(confKey) === 'true';
  }
  
  if (typeof(env) !== 'undefined' && env !== null) { 
    return env === 'true';
  }
  return fallback;
}

const config = {
  appId: kioskConf.get('app_id') ?? import.meta.env.VITE_APP_ID,
  baseUrl: import.meta.env.VITE_BASE_URL || '/',
  cacheTime: parseInt(kioskConf.get('cache_ttl') ?? "3600000"),
}

console.log('Site config: ' + JSON.stringify(config))

export default config;
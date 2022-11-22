import * as build from './source/builder/build';

process.env.TZ = 'Asia/Tokyo';

build.execute(__dirname);

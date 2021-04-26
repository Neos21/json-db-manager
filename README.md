# JSON DB Manager

JSON DB Manager.


## Client

- `./client/src/environments/environment.ts`
- `./client/src/environments/environment.prod.ts`
    - `production` : Boolean
    - `apiRootPath` : String
        - Dev : `http://localhost:8080/api`
        - Prod : `/api`
- `$ npm run devc`
    - <http://localhost:4200/>
    - `$ npm run ng`
- `$ npm run buildc`
    - `./client/dist/`
    - `$ npm run build` (Client And Server)


## Server

- `./server/index.ts`
    - `process.env.PORT` : Default `8080`
- `./server/.env`
- `./server/constants.ts`
    - `USERNAME` : Required
    - `PASSWORD` : Required
    - `DB_DIRECTORY_PATH` : Required, Resolve Path Relative To The Project Root `./`
- `$ npm run devs`
    - <http://localhost:8080/> (Default)
- `$ npm run builds`
    - `./server/dist/`
    - `$ npm run build` (Client And Server)
- `$ npm start`
    - <http://localhost:8080/> (Default)
    - Refers `./client/dist/`


## Links

- [Neo's World](https://neos21.net/)

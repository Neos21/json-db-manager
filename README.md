# JSON DB Manager

JSON DB Manager.


## Client

- `./client/src/environments/environment.ts`
- `./client/src/environments/environment.prod.ts`
    - `production` : Boolean
    - `apiRootPath` : String
        - Dev : `http://localhost:2222/api`
        - Prod : `/api`
- `$ npm run devc`
    - <http://localhost:4200/>
    - `$ npm run ng`
- `$ npm run buildc`
    - `./client/dist/`
    - `$ npm run build` (Client And Server)


## Server

- `./server/index.ts`
    - `process.env.PORT` : Default `2222`
- `./.env`
- `./server/constants.ts`
    - `USERNAME` : Required
    - `PASSWORD` : Required
    - `DB_DIRECTORY_PATH` : Required, Resolve Path Relative To The Project Root `./`
- `$ npm run devs`
    - <http://localhost:2222/> (Default)


## Run

- `$ npm run builds`
    - `./server/dist/`
    - `$ npm run build` (Client And Server)
- `$ npm start`
    - <http://localhost:2222/> (Default)
    - Refers `./client/dist/`
- `$ nohup npm start &`
- `$ pkill npm`


## Links

- [Neo's World](https://neos21.net/)

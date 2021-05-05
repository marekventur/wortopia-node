#!/usr/bin/env node
import bunyan from "bunyan";

import Clock from "./src/Clock.js";
import Db from "./src/Db.js";
import userManagementDecorator from "./src/decorator/UserManagement.js";
import userPasswordHashDecorator from "./src/decorator/UserPasswordHash.js";
import userOptionsDecorator from "./src/decorator/UserOptions.js";
import UserDao from "./src/UserDao.js";
import fieldGeneralDecorator from "./src/decorator/FieldGeneral.js";

import fieldStartingCombinationsDecorator from "./src/decorator/FieldStartingCombinations.js";
import fieldContainsDecorator from "./src/decorator/FieldContains.js";
import fieldDatabaseDecorator from "./src/decorator/FieldDatabase.js";
import fieldPlayersDecorator from "./src/decorator/FieldPlayers.js";
import fieldGuessDecorator from "./src/decorator/FieldGuess.js";
import FieldGenerator from "./src/game/FieldGenerator.js";
import ExpressWrapper from "./src/ExpressWrapper.js";
import Socket from "./src/Socket.js";
import Chat from "./src/Chat.js";
import HighscoreQuery from "./src/HighscoreQuery.js";
import HttpServer from "./src/HttpServer.js";
import MessageAuthenticationCodeManager from "./src/MessageAuthenticationCodeManager.js";
import RecoverLinkManager from "./src/RecoverLinkManager.js";
import UserOptions from "./src/UserOptions.js";
import SesClient from "./src/SesClient.js";
import GameServer from "./src/game/GameServer.js";
import GuessHandler from "./src/game/GuessHandler.js";
import SignupHandler from "./src/handler/SignupHandler.js";
import LoginHandler from "./src/handler/LoginHandler.js";
import AccountHandler from "./src/handler/AccountHandler.js";
import RecoverHander from "./src/handler/RecoverHandler.js";
import HighscoreHandler from "./src/handler/HighscoreHandler.js";

import config from "./config.js";

(async () => {
    const logger = bunyan.createLogger({name: "main"});
    const clock = new Clock();
    const db = new Db(config, logger);
    const userDecorator = user => {
        userManagementDecorator(user, db, logger);
        userPasswordHashDecorator(user);
        userOptionsDecorator(user, db);
        return user;
    }
    const userDao = new UserDao(db, logger, userDecorator);
    const fieldDecorator = field => {
        fieldGeneralDecorator(field);
        fieldContainsDecorator(field);
        fieldStartingCombinationsDecorator(field);
        fieldDatabaseDecorator(field, db, logger, config);
        fieldPlayersDecorator(field, db);
        fieldGuessDecorator(field);
        return field;
    }
    const fieldGenerator = new FieldGenerator(config, fieldDecorator);
    const expressWrapper = new ExpressWrapper(config, logger);
    const socket = new Socket(config, logger, userDao);
    const chat = new Chat(socket, logger, config, clock);
    const highscoreQuery = new HighscoreQuery(db);
    const httpServer = new HttpServer(expressWrapper, socket, config, logger);
    const messageAuthenticationCodeManager = new MessageAuthenticationCodeManager(config);
    const recoverLinkManager = new RecoverLinkManager(config, messageAuthenticationCodeManager, userDao);
    const userOptions = new UserOptions(socket, logger);
    const sesClient = new SesClient(config, logger);
    const gameServer = new GameServer(config, fieldGenerator, logger, socket);
    const guessHandler = new GuessHandler(gameServer, logger, socket);
    const signupHandler = new SignupHandler(expressWrapper, userDao, logger);
    const loginHandler = new LoginHandler(expressWrapper, userDao, logger);
    const accountHandler = new AccountHandler(expressWrapper, userDao, logger);
    const recoverHandler = new RecoverHander(expressWrapper, userDao, recoverLinkManager, sesClient, logger, config);
    const highscoreHandler = new HighscoreHandler(expressWrapper, highscoreQuery, logger);

    await socket.start();
    await chat.start();
    await expressWrapper.start();
    await httpServer.start();
    await userOptions.start();
    await gameServer.start();
    await guessHandler.start();
    await accountHandler.start();
    await highscoreHandler.start();
    await loginHandler.start();
    await recoverHandler.start();
    await signupHandler.start();

    logger.info('Server has successfully started');
})().catch(console.error);

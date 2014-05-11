require('./setup');

describe('Chat', function() {
    var chat, user, socket, now;

    beforeEach(function() {
        setUpDi();

        di.get('config').chatMessages = {
            'test': 'translated message %s'
        }

        chat = di.get('chat');
        user = di.get('userDecorator').decorate({
            id: 1
        });
        socket = di.get('socket');
        now = 123456;
        di.get('clock').now = function () { return now; };
        socket.broadcast = sinon.spy();
    });

    it('emits an event for new messages', function() {
        chat.addMessage(user, 4, 'test');
        assert.ok(socket.broadcast.calledOnce);
        assert.equal(socket.broadcast.firstCall.args[0], 'chat');
        assert.equal(socket.broadcast.firstCall.args[1], 4);
        var message = socket.broadcast.firstCall.args[2];
        assert.deepEqual(message.user, user.getExternalPublicRepresentation());
        assert.equal(message.text, 'test');
        assert.equal(message.time, now);
    });

    it('adds messages to backlog', function() {
        chat.addMessage(user, 4, 'test1');
        chat.addMessage(user, 4, 'test2');
        assert.equal(chat.getMessages(4).length, 2);
        assert.equal(chat.getMessages(5).length, 0);
        assert.deepEqual(chat.getMessages(4)[0].user, user.getExternalPublicRepresentation());
        assert.equal(chat.getMessages(4)[0].text, 'test1');
        assert.equal(chat.getMessages(4)[1].text, 'test2');
        assert.equal(chat.getMessages(4)[1].time, now);
    });


    it('#addSystemMessage adds system messages to backlog', function() {
        chat.addSystemMessage(4, 'test', ['hello']);
        assert.equal(chat.getMessages(4).length, 1);
        assert.equal(chat.getMessages(5).length, 0);
        assert.equal(chat.getMessages(4)[0].text, 'translated message hello');
        assert.equal(chat.getMessages(4)[0].time, now);
        assert.ok(chat.getMessages(4)[0].system);
    });

    it('#addGlobalSystemMessage adds system messages to backlog all backlogs ', function() {
        chat.addGlobalSystemMessage('test', ['hello']);
        assert.equal(chat.getMessages(4).length, 1);
        assert.equal(chat.getMessages(5).length, 1);
        assert.equal(chat.getMessages(4)[0].text, 'translated message hello');
        assert.equal(chat.getMessages(4)[0].time, now);
        assert.ok(chat.getMessages(4)[0].system);
    });

    it('#cleanUp works as expected', function() {
        di.get('config').chatRetentionTime = 100;

        now = 1;
        chat.addMessage(user, 4, 'test1');
        now = 50;
        chat.addMessage(user, 4, 'test50');
        assert.equal(chat.getMessages(4).length, 2);

        chat.cleanUp();
        assert.equal(chat.getMessages(4).length, 2);

        now = 120;
        chat.cleanUp();
        assert.equal(chat.getMessages(4).length, 1);

    });

});

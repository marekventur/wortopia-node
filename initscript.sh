#!/bin/bash

### BEGIN INIT INFO
# Provides:             wortopia
# Required-Start:       $all
# Required-Stop:        $all
# Default-Start:        2 3 4 5
# Default-Stop:         0 1 6
# Short-Description:    Wortopia
### END INIT INFO

DAEMON_ENV = "NODE_ENV=production"
DAEMON="/var/www/wortopia/app.js"
DAEMON_ARGS="/etc/wortopia/config.js"
DAEMON_NAME=wortopia

DAEMON_USER=wortopia
PID_FILE=/var/run/wortopia.pid
WORKING_DIR=/var/www/wortopia
DESC="Wortopia"

if [ `id -u` -ne 0 ]; then
    echo "You need root privileges to run this script"
    exit 1
fi

. /lib/lsb/init-functions

if [ -r /etc/default/rcS ]; then
    . /etc/default/rcS
fi

start() {
    log_daemon_msg "Starting $DESC"

    start-stop-daemon --start --background \
        --chuid $DAEMON_USER \
        -n $DAEMON_NAME \
        -d $WORKING_DIR \
        --pidfile $PID_FILE --make-pidfile \
        --exec /usr/bin/env \
        --startas /usr/bin/pipexec -- -k \
        -- [ D /usr/bin/env $DAEMON $DAEMON_ARGS ] [ L /usr/bin/logger --tag $DAEMON_NAME ] '{D:2>D:1}' '{D:1>L:0}'

    log_end_msg $?
}

stop() {
    log_daemon_msg "Stopping $DESC"

    if [ -f "$PID_FILE" ]; then
        start-stop-daemon --stop --pidfile "$PID_FILE" \
            --user "$DAEMON_USER" \
            --retry=TERM/20/KILL/5 >/dev/null
        if [ $? -eq 1 ]; then
            log_progress_msg "$DESC is not running but pid file exists, cleaning up"
        elif [ $? -eq 3 ]; then
            PID="`cat $PID_FILE`"
            log_failure_msg "Failed to stop $DESC (pid $PID)"
            exit 1
        fi
        rm -f "$PID_FILE"
    else
        log_progress_msg "(not running)"
    fi
    log_end_msg 0
}

status() {
    status_of_proc -p $PID_FILE $DAEMON $DESC && exit 0 || exit $?
}

restart() {
    if [ -f "$PID_FILE" ]; then
        $0 stop
        sleep 1
    fi
    $0 start
}

case "$1" in
    start | stop | status | restart)
        $1
        ;;
    *)
        echo "Usage: $0 {start|stop|status|restart}"
        exit 2
esac

exit $?
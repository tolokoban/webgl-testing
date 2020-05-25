#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"

DIRNAME=`basename \`realpath $DIR/..\``
NAME="byobu-$DIRNAME"

if [ -z "$(byobu-tmux list-sessions | grep $NAME)" ]
then
    byobu-tmux new-session -d -t "$NAME"

    byobu-tmux new-window
    byobu-tmux rename-window $DIRNAME
    byobu-tmux send-keys -t 0 "cd '$DIR/..'" 'C-m'
    byobu-tmux send-keys -t 0 'atom .' 'C-m'
    byobu-tmux split-window -h
    byobu-tmux send-keys -t 1 "cd '$DIR/..'" 'C-m'
    byobu-tmux send-keys -t 1 'npm start' 'C-m'
    byobu-tmux split-window -v
    byobu-tmux send-keys -t 2 "cd '$DIR/..'" 'C-m'
    byobu-tmux send-keys -t 2 'npm test' 'C-m'
fi
# Enter byobu-tmux
byobu-tmux attach -t "$NAME"

#!/bin/sh

CURR_DIR=$(dirname $0)

gdb --args ./bin/sogclient $(cat data/config/local)

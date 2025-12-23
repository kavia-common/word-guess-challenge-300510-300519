#!/bin/bash
cd /home/kavia/workspace/code-generation/word-guess-challenge-300510-300519/wordle_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi


#!/bin/sh

echo "⏳ Waiting for MongoDB..."

while ! nc -z mongo 27017; do
  sleep 1
done

echo "✅ MongoDB started"
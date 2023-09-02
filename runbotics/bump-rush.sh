#!/bin/sh

rush version --bump --version-policy rbPolicy
rush change --bulk --bump-type patch --message bump --no-fetch

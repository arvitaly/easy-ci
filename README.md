# EasyCI: very easy continuous integration tool for Github with docker support

[![Greenkeeper badge](https://badges.greenkeeper.io/arvitaly/easy-ci.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/arvitaly/easy-ci.svg?branch=master)](https://travis-ci.org/arvitaly/easy-ci)
[![npm version](https://badge.fury.io/js/easy-ci.svg)](https://badge.fury.io/js/easy-ci)

# How to use

EasyCI create http-server for listen github webhooks. Service support multiple repositories. Before start, you should create config file with settings for every repository.

After call hook, EasyCI start "git pull" with ssh-key from settings and after start `command` (from settings). 
You can set any path for repository, where need use `git pull`.
Config can be found by this code:

    process.env.CONFIG || "/etc/easy-ci/config.js"

# Example of config

    var secret = require("./secret");`
    module.exports = {`
    `repos: {`
        repo1: {
            //repository ssh deploy key path https://developer.github.com/guides/managing-deploy-keys/
            key: "/var/keys/key1",
            //github webhook secret https://developer.github.com/webhooks/securing/#setting-your-secret-token
            secret: secret,
            path: "/var/easy-ci/repo1",
            command: () => {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("hello");
                    }, 10);
                });
            }
        }
    }
}`
# Use with docker
Docker image `arvitaly/easy-ci` from hub, just pull it

    docker pull arvitaly/easy-ci

You can mount any path for every repositories and for config file

    docker run -v /var/easy-ci/config.js:/etc/easy-ci/config.js -v /var/easy-ci/repo1:/var/easy-ci/repo1 --name easy-ci --publish=7654:7654 -d arvitaly/easy-ci
    
# HTTPS

EasyCI not support https, but you can use nginx (or other) with `Let's Encrypt` https://letsencrypt.org/ https://www.nginx.com/blog/free-certificates-lets-encrypt-and-nginx/ and proxy http://nginx.org/ru/docs/http/ngx_http_proxy_module.html

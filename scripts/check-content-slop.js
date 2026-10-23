#!/usr/bin/env node
"use strict"

const { main } = require("./content-audit/audit")

const ok = main()
if (!ok) process.exitCode = 1

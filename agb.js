function escapeHtml(a) {
  return String(a).replace(/[&<>"'\/]/g, function(a) {
    return entityMap[a];
  });
}
function updateBotCount(a, b) {
    Singa.localBotsAlive[a] = b;
    for (var c = 0, d = 0; d < 9; d++) Singa.localBotsAlive[d] && c++;
    0 == c ? $("#botCount").html('<font color="red">0 / 99</font>') : $("#botCount").html('<font color="green">' + c + " / 99</font>")
}

function startLocalBots() {
    for (var i = 0; i < 9; i++) Singa.localBotsAlive[i] = !6, Singa.localBots[i] = new Worker(URL.createObjectURL(new Blob(["(" + eval(worker_function).toString() + ")()"], {
        type: "text/javascript"
    }))), Singa.localBots[i].onmessage = function(a) {
        var b = a.data;
        switch (b.name) {
            case "add":
                updateBotCount(b.botID, !0), addBallToMinimap(!1, "bot" + b.botID, b.botName, "#FF00FF", !0), moveBallOnMinimap("bot" + b.botID, b.x, b.y);
                break;
            case "remove":
                updateBotCount(b.botID, !1), removeBallFromMinimap("bot" + b.botID);
                break;
            case "position":
                moveBallOnMinimap("bot" + b.botID, b.x, b.y);
                break;
            default:
                console.log("Unknown command received from bot")
        }
    }, Singa.localBots[i].postMessage({
        name: "botID",
        botID: i
    })
}

function startRemoteBots() {
    for (var a = 0; a < 3; a++) Singa.remoteBots[a] = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], {
        type: "text/javascript"
    }))), Singa.remoteBots[a].postMessage({
        name: "botID",
        botID: a
    })
}

function sendLocalBotsMessage(a) {
    for (i in Singa.localBots) Singa.localBots[i].postMessage(a)
}

function sendRemoteBotsMessage(a) {
    for (i in Singa.remoteBots) Singa.remoteBots[i].postMessage(a)
}

function insertCore() {
    var f = new XMLHttpRequest;
    f.open("GET", "/agario.core.js", !0), f.onload = function() {
        var script = f.responseText;
        script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "Singa.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "Singa.playerDied();if(h.MC&&h.MC.onPlayerDeath)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "Singa.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)"), script = replaceNormalFile(script, "connect:function(a){", "connect:function(a){Singa.playerConnected(a);"), script = replaceNormalFile(script, "sendSpectate:function(){", "sendSpectate:function(){Singa.playerSpectated();"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "Singa.playerDisconnected();if(h.MC&&h.MC.onDisconnect)"), script = replaceNormalFile(script, "sendNick:function(a){", "sendNick:function(a){Singa.updateNickname(a);"), script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(Singa.setMapCoords){Singa.setMapCoords($3,$5,$7,$9,$2,$8);}"), script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 Singa.playerX=$4; Singa.playerY=$5;"), script = replaceNormalFile(script, "setTarget:function(a,b){", "setTarget:function(a,b){if(Singa.stopMovement){a = $('#canvas').width() / 2; b = $('#canvas').height() / 2;}"), script = replaceRegexFile(script, /if\((\+\w\[\w>>3\])<1\.0\){/i, "if($1 < Singa.zoomResetValue){"), script = replaceRegexFile(script, /(if\(\w<=)(20\.0)(\){\w=\w;return})(if\(!\w\){if\(\(\w\[\d+\]\|0\)!=\(\w\[\d+\]\|0\)\){\w=\w;return}if\(\(\w\[\w\+\d+>>0\]\|0\)!=0\?\(\w\[\w>>0\]\|0\)==0:0\){\w=\w;return}})/i, "$140.0$3"), script = replaceRegexFile(script, /(\w)(=\+\w\[\w>>3\]\*\+\w\()(.\d)(,\+\w\);)/i, "$1$2 (Singa.zoomSpeedValue||0.9) $4 Singa.zoomValue=$1;"), script = replaceRegexFile(script, /(\w=\w\[\w>>2\]\|0;)((\w\[\w>>3\])=(\w);)(\w\[\w>>0\]=a\[\w>>0\];)/i, "$1 if(!Singa.autoZoom){$3 = Singa.zoomValue;}else{$2}$5"), script = replaceRegexFile(script, /((\w)=(\+\(\(\w\[\w\+\d+>>\d.*;)(\w)=(\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];).*\4=\4<\w\?\w:\w;)/, "Singa.mouseX = $3 Singa.mouseY = $5 $1"), eval(script)
    }, f.send()
}

function resetMinimap() {
    $("#balls_holder").empty()
}

function createMinimap() {
    var a = document.createElement("div");
    a.id = "minimap", a.style.cssText = 'background:rgba(0,0,0,0.4)url("http://www.singaclan.tk/minimap.png");background-size:100%100%;width:249px;height:249px;right:0px;bottom:0px;position:fixed;z-index:1;pointer-events:none;', $(document.body).append(a);
    var b = document.createElement("div");
    b.id = "balls_holder", $("#minimap").append(b)
}

function addBallToMinimap(a, b, c, d, e) {
    if (b = b.replace("#", ""), b = b.replace("/", ""), !$("#" + b).length) {
        var f = document.createElement("div");
        f.id = b, f.style.cssText = "border-radius:50%;margin-top:-5px;margin-left:-5px;width:10px;height:10px;position:absolute;color:" + d + ";background-color:" + d + ";" + (e ? "" : "display:none;"), $(a ? "#minimap" : "#balls_holder").append(f), changeNicknameOnBall(b, c)
    }
}

function removeBallFromMinimap(a) {
    a = a.replace("#", ""), a = a.replace("/", ""), $("#" + a).remove()
}

function moveBallOnMinimap(a, b, c) {
    a = a.replace("#", ""), a = a.replace("/", "");
    var d = (b + 7071) / 14142 * 100,
        e = (c + 7071) / 14142 * 100;
    $("#" + a).css({
        left: d + "%",
        top: e + "%"
    })
}

function setBallVisible(a, b) {
    a = a.replace("#", ""), a = a.replace("/", ""), b ? $("#" + a).show() : $("#" + a).hide()
}

function changeNicknameOnBall(a, b) {
    a = a.replace("#", ""), a = a.replace("/", ""), $("#" + a).html('<div style="font-size:10px;bottom:10px;position:absolute;font-family: Ubuntu, fantasy;width:300px;left:' + -((getTextWidth(b, "10px Ubuntu, fantasy") - 10) / 2) + 'px">' + b + "</div>")
}

function replaceRegexFile(a, b, c) {
    var d = new RegExp(b);
    return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
}

function replaceNormalFile(a, b, c) {
    return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
}

function sendCommand(a) {
    null != socket && socket.emit("command", a)
}

function connectToSingaServer() {
    socket = io.connect("ws://96.31.85.154:8084", {
        reconnection: !0,
        query: "key=" + client_uuid
    }), socket.on("command", function(a) {
        if (null == a.name) return void console.log("Recieved a command with no name.");
        switch (a.name) {
            case "force-update":
                resetMinimap(), transmit_current_server(!0), Singa.isAlive && sendCommand({
                    name: "alive",
                    playerName: Singa.playerName
                });
                break;
            case "add":
                addBallToMinimap(!1, a.socketID, a.playerName, "#FFFFFF", !0), moveBallOnMinimap(a.socketID, a.x, a.y);
                break;
            case "remove":
                removeBallFromMinimap(a.socketID);
                break;
            case "position":
                moveBallOnMinimap(a.socketID, a.x, a.y);
                break;
            case "spawn-count":
                $("#botCount").html('<font color="green">' + a + "</font>");
                break;
            default:
                return void console.log("Received a command with an unknown name: " + a.name)
        }
    }), socket.on("bots", function(a) {
        sendRemoteBotsMessage(a)
    }), socket.on("disconnect", function() {
        resetMinimap()
    })
}

function sendNamesToServer(a) {
    sendCommand({
        name: "bot-names",
        botNames: a
    })
}

function validateNames(a) {
    if (void 0 === a) return null;
    if (a.indexOf(",") > -1) {
        var b = a.split(",");
        for (name in b)
            if (b[name].length <= 0 || b[name].length > 15) return null;
        return b
    }
    return a.length > 0 && a.length <= 15 ? [a] : null
}

function emitSplit() {
    sendCommand({
        name: "split"
    }), sendLocalBotsMessage({
        name: "split"
    })
}

function emitMassEject() {
    sendCommand({
        name: "eject"
    }), sendLocalBotsMessage({
        name: "eject"
    })
}

function emitPosition() {
    var a = Singa.mouseX,
        b = Singa.mouseY;
    Singa.moveToMouse || (a = Singa.playerX, b = Singa.playerY), sendLocalBotsMessage({
        name: "position",
        x: a + Singa.mapOffsetX,
        y: b + Singa.mapOffsetY
    }), sendCommand({
        name: "position",
        x: Singa.realPlayerX,
        y: Singa.realPlayerY,
        botX: a + Singa.mapOffsetX,
        botY: b + Singa.mapOffsetY
    })
}

function transmit_current_server(a) {
    (a || last_transmited_game_server != Singa.server) && (last_transmited_game_server = Singa.server, sendCommand({
        name: "server",
        server: last_transmited_game_server
    }))
}

function worker_function() {
    function replaceRegexFile(a, b, c) {
        var d = new RegExp(b);
        return d.test(a) ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
    }

    function replaceNormalFile(a, b, c) {
        return a.indexOf(b) != -1 ? a = a.replace(b, c) : console.log("[Failed] to replace: " + b), a
    }

    function getRandomInt(a, b) {
        return Math.floor(Math.random() * (b - a + 1)) + a
    }

    function getBotCore() {
        var o = new XMLHttpRequest;
        o.open("GET", "http://agar.io/agario.core.js", !0), o.onreadystatechange = function() {
            if (4 == o.readyState) {
                var script = o.responseText;
                script = replaceRegexFile(script, /\w+\.location\.hostname/g, '"agar.io"'), script = replaceNormalFile(script, "window", "self"), script = replaceNormalFile(script, "c.setStatus=function(a){console.log(a)};", "c.setStatus=function(a){};"), script = replaceNormalFile(script, 'console.log("postRun");', ""), script = replaceRegexFile(script, /(\w)=\+\(\(\w\[\w\+\d+>>\d.*;(\w)=\+\(\(\w\[.*\/2\|\d\)\|0\)\/\w\+\s\+\w\[\w\+\d+>>3\];/, "$1 = Singa.newX; $2 = Singa.newY; $3 = Singa.newX;"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerSpawn)", "Singa.playerSpawned();if(h.MC&&h.MC.onPlayerSpawn)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onPlayerDeath)", "Singa.playerDied();if(h.MC&&h.MC.onPlayerDeath)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onAgarioCoreLoaded)", "Singa.onAgarioCoreLoaded();if(h.MC&&h.MC.onAgarioCoreLoaded)"), script = replaceNormalFile(script, "if(h.MC&&h.MC.onDisconnect)", "Singa.playerDisconnected();if(h.MC&&h.MC.onDisconnect)"), script = replaceNormalFile(script, "h.MC&&h.MC.corePendingReload", "Singa.reloadCore();h.MC&&h.MC.corePendingReload"), script = replaceRegexFile(script, /(\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);\w\[\w\+(\d+)>>3]=(\w);)/i, "$1 if(Singa.setMapCoords){Singa.setMapCoords($3,$5,$7,$9,$2,$8);}"), script = replaceRegexFile(script, /([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, "$1 Singa.playerX=$4; Singa.playerY=$5;"), eval(script)
            }
        }, o.send(null)
    }
    self.innerWidth = 1, self.innerHeight = 1;
    const window = {},
        elementMock = {
            getContext: function() {
                return {
                    canvas: {
                        width: 1,
                        height: 1
                    },
                    clearRect: function() {},
                    save: function() {},
                    translate: function() {},
                    scale: function() {},
                    stroke: function() {},
                    arc: function() {},
                    fill: function() {},
                    moveTo: function() {},
                    lineTo: function() {},
                    closePath: function() {},
                    beginPath: function() {},
                    restore: function() {},
                    fillRect: function() {},
                    measureText: function() {
                        return {}
                    },
                    strokeText: function() {},
                    fillText: function() {},
                    drawImage: function() {}
                }
            },
            innerText: "",
            div: {
                appendChild: function() {}
            },
            appendChild: function() {},
            style: {}
        },
        document = {
            getElementById: function() {
                return elementMock
            },
            createElement: function(a) {
                return elementMock
            },
            body: {
                firstChild: {},
                insertBefore: function() {}
            }
        },
        Image = function() {};
    self.Singa = {
        server: null,
        botID: 0,
        botName: "TrapKillo",
        playerX: 0,
        playerY: 0,
        newX: 0,
        newY: 0,
        realPlayerX: null,
        realPlayerY: null,
        mapOffset: 7071,
        mapOffsetX: 0,
        mapOffsetY: 0,
        mapOffsetFixed: !1,
        setMapCoords: function(a, b, c, d, e, f) {
            f - e == 24 && c - a > 14e3 && d - b > 14e3 && (this.mapOffsetX = this.mapOffset - c, this.mapOffsetY = this.mapOffset - d, this.mapOffsetFixed = !0)
        },
        playerDied: function() {
            postMessage({
                name: "remove",
                botID: Singa.botID
            })
        },
        playerSpawned: function() {
            postMessage({
                name: "add",
                botID: Singa.botID,
                botName: Singa.botName,
                x: Singa.realPlayerX,
                y: Singa.realPlayerY
            })
        },
        playerDisconnected: function() {
            postMessage({
                name: "remove",
                botID: Singa.botID
            }), self.core && core.connect(Singa.server), Singa.isAlive = !1
        },
        reloadCore: function() {
            self.core && self.core.destroy(), getBotCore()
        },
        onAgarioCoreLoaded: function() {
            null != Singa.server && self.core && core.connect(Singa.server)
        }
    }, onmessage = function(a) {
        var b = a.data;
        switch (b.name) {
            case "botID":
                Singa.botID = b.botID;
                break;
            case "server":
                Singa.server = b.server, self.core && core.connect(b.server);
                break;
            case "position":
                Singa.newX = b.x - Singa.mapOffsetX, Singa.newY = b.y - Singa.mapOffsetY;
                break;
            case "split":
                core.split();
                break;
            case "eject":
                core.eject();
                break;
            case "names":
                if (null == b.botNames) {
                    Singa.botName = "TrapKillo";
                    break
                }
                Singa.botName = b.botNames[getRandomInt(0, b.botNames.length - 1)];
                break;
            default:
                console.log("Unknown message received.")
        }
    }, setInterval(function() {
        Singa.realPlayerX = Singa.mapOffsetX + Singa.playerX, Singa.realPlayerY = Singa.mapOffsetY + Singa.playerY, postMessage({
            botID: Singa.botID,
            name: "position",
            x: Singa.realPlayerX,
            y: Singa.realPlayerY
        }), self.core && core.sendNick(Singa.botName)
    }, 100), getBotCore()
}
window.history.replaceState("", "", "/" + location.hash), window.getTextWidth = function(a, b) {
    var c = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas")),
        d = c.getContext("2d");
    d.font = b;
    var e = d.measureText(a);
    return e.width
};
var client_uuid = localStorage.getItem("singa_uuid");
if (null === client_uuid) {
    client_uuid = "";
    for (var ranStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", ii = 0; ii < 15; ii++) client_uuid += ranStr.charAt(Math.floor(Math.random() * ranStr.length));
    localStorage.setItem("singa_uuid", client_uuid)
}
window.Singa = {
    server: null,
    playerName: "",
    playerX: 0,
    playerY: 0,
    mouseX: 0,
    mouseY: 0,
    realPlayerX: null,
    realPlayerY: null,
    mapOffset: 7071,
    mapOffsetX: 0,
    mapOffsetY: 0,
    mapOffsetFixed: !1,
    zoomValue: 1,
    zoomResetValue: 0,
    zoomSpeedValue: .9,
    autoZoom: !0,
    stopMovement: !1,
    isAlive: !1,
    moveToMouse: !0,
    localBots: {},
    localBotsAlive: {},
    remoteBots: {},
    remoteBotsAlive: {},
    setMapCoords: function(a, b, c, d, e, f) {
        f - e == 24 && c - a > 14e3 && d - b > 14e3 && (this.mapOffsetX = this.mapOffset - c, this.mapOffsetY = this.mapOffset - d, this.mapOffsetFixed = !0)
    },
    playerDied: function() {
        Singa.isAlive = !1, moveBallOnMinimap("player_death", this.realPlayerX, this.realPlayerY), $("#player_pointer").hide(), $("#player_death").show(), sendCommand({
            name: "dead"
        })
    },
    playerSpawned: function() {
        Singa.isAlive = !0, changeNicknameOnBall("player_pointer", Singa.playerName), $("#player_spectate").hide(), $("#player_pointer").show(), sendCommand({
            name: "alive",
            playerName: Singa.playerName
        })
    },
    playerConnected: function(a) {
        resetMinimap(), Singa.server = a, console.log("Connecting to: " + a), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), sendLocalBotsMessage({
            name: "server",
            server: a
        })
    },
    playerDisconnected: function() {
        resetMinimap(), setBallVisible("player_pointer", !1), setBallVisible("player_death", !1), setBallVisible("player_spectate", !1), console.log("Disconnected from server."), Singa.server = null, Singa.isAlive = !1
    },
    playerSpectated: function() {
        $("#player_pointer").hide(), $("#player_spectate").show()
    },
    updateNickname: function(a) {
        this.playerName = a
    },
    loadCore: function() {
        setTimeout(function() {
            startLocalBots(), startRemoteBots()
        }, 2e3), console.log("Loading core.");
        var b = (document.getElementById("canvas"), localStorage.getItem("botnames"));
        null !== b && (Singa.botNames = validateNames(b), null !== Singa.botNames && $("#botnames").val(b), sendLocalBotsMessage({
            name: "names",
            botNames: Singa.botNames
        })), $("#botnames").on("input", function() {
            var a = $("#botnames").val(),
                b = validateNames(a);
            Singa.botNames = b, sendNamesToServer(b), sendLocalBotsMessage({
                name: "names",
                botNames: Singa.botNames
            }), null !== b && localStorage.setItem("botnames", a)
        });
        var c, d = !1,
            e = !1,
            f = !1;
        $(document).keydown(function(a) {
            switch (a.which) {
                case 65:
                    Singa.moveToMouse = !Singa.moveToMouse, Singa.moveToMouse ? $("#ismoveToMouse").html("<font color='green'>On</font>") : $("#ismoveToMouse").html("<font color='red'>Off</font>");
                    break;
                case 68:
                    Singa.stopMovement = !Singa.stopMovement, Singa.stopMovement ? $("#isStopMove").html("<font color='green'>On</font>") : $("#isStopMove").html("<font color='red'>Off</font>");
                    break;
                case 69:
                    emitSplit();
                    break;
                case 82:
                    emitMassEject();
                    break;
                case 72:
                    e = !e, e ? $("#botcanvas").hide() : $("#botcanvas").show();
                    break;
                case 72:
                    e = !e, e ? $("#botcanvas").hide() : $("#botcanvas").show();
                    break;
                case 77:
                    f = !f, f ? $("#minimap").hide() : $("#minimap").show();
                    break;
                case 87:
                    if (d) return;
                    d = !0, c = setInterval(function() {
                        core.eject()
                    }, 50)
            }
        }), $(document).keyup(function(a) {
            switch (a.which) {
                case 87:
                    d = !1, clearInterval(c);
                    break;
                case 84:
                    var b = 0,
                        e = setInterval(function() {
                            return b > 7 ? void clearInterval(e) : (b++, void core.split())
                        }, 50);
                    break;
                case 81:
                    var f = 0,
                        g = setInterval(function() {
                            return f > 1 ? void clearInterval(g) : (f++, void core.split())
                        }, 50)
            }
        }), createMinimap(), addBallToMinimap(!0, "player_pointer", Singa.playerName, "#00FF00", !1), addBallToMinimap(!0, "player_death", "Last Death", "#FF2400", !1), addBallToMinimap(!0, "player_spectate", "Spectate", "#0000FF", !1), connectToSingaServer(), insertCore(), setInterval(function() {
            MC.singaFreeCoins()
        }, 5e3)
    },
    reloadCore: function() {
        console.log("Reloading Core."), insertCore()
    },
    onAgarioCoreLoaded: function() {
        console.log("Loading settings into agario core."), core.setSkins(!$("#noSkins").is(":checked")), core.setNames(!$("#noNames").is(":checked")), core.setColors(!$("#noColors").is(":checked")), core.setShowMass($("#showMass").is(":checked")), core.setDarkTheme($("#darkTheme").is(":checked"))
    }
};
var b = new XMLHttpRequest;
b.open("GET", "/mc/agario.js", !0), b.onload = function() {
    var script = b.responseText;
    script = replaceNormalFile(script, 'if(js.keyCode==32&&i1!="nick"){js.preventDefault()}', ""), script = replaceNormalFile(script, "showAds:function(i){if", "showAds:function(i){},showFuck:function(i){if"), script = replaceNormalFile(script, "showPromoBadge:function(", "showPromoBadge:function(i){},fuckbacks: function("), script = replaceRegexFile(script, /(return\s\w+.tab.toUpperCase\(\)).indexOf\(\w+.toUpperCase\(\)\)!=-1/, "$1 != 'VETERAN'"), script = replaceRegexFile(script, /if\(\w+.shouldSkipConfigEntry\(\w+.productIdToQuantify.*visibility\)\)\{continue\}/, ""), script = replaceNormalFile(script, "if(this.getSkinsByCategory(i1.tabDescription).length>0", 'if (this.getSkinsByCategory(i1.tabDescription).length > 0 && (i1.tabDescription.toUpperCase() == "PREMIUM" || i1.tabDescription.toUpperCase() == "VETERAN" || i1.tabDescription.toUpperCase() == "OWNED")'), script = replaceRegexFile(script, /var\si2=window.document.createElement..script..+head.appendChild.i2../i, "Singa.reloadCore();"), script = replaceRegexFile(script, /(showFreeCoins:function\(\)\{var.*showContainer\(\);if\(([a-zA-Z0-9]+[a-zA-Z0-9]+.user.userInfo==null).*false\);([a-zA-Z0-9]+[a-zA-Z0-9]+.triggerFreeCoins\(\)).*this.onShopClose\)\)\}},)/, "$1 singaFreeCoins: function(){if($2){return;}$3;},"), eval(script);
    var e = new XMLHttpRequest;
    e.open("GET", "/", !0), e.onload = function() {
        var a = e.responseText;
        a = replaceNormalFile(a, '<script src="agario.core.js" async></script>', "<div id='botcanvas' style='background-color: #000000; -moz-opacity: 0.4; -khtml-opacity: 0.4; opacity: 0.4; filter: alpha(opacity=40); zoom: 1; width: 205px; top: 10px; left: 10px; display: block; position: absolute; text-align: center; font-size: 15px; color: #ffffff; padding: 5px; font-family: Ubuntu;'> <a>TrapBots</a><br>Bots: <a id='botCount'><font color='red'>0 / 99</font></a></div>"), a = replaceNormalFile(a, "<body>", '<body onload="Singa.loadCore()">'), a = replaceRegexFile(a, /<script type="text\/javascript" src="mc\/agario\.js.*"><\/script>/i, ""), a = replaceRegexFile(a, /<div id="adsBottom".*display:block;">/i, '<div id="adsBottom" style="display:none">'), a = replaceNormalFile(a, '<div class="diep-cross" style="', '<div class="diep-cross" style="display:none;'), a = replaceNormalFile(a, '<div id="promo-badge-container">', '<div id="promo-badge-container" style="display:none;">'), a = replaceNormalFile(a, '<span data-itr="page_instructions_w"></span><br/>', '<span data-itr="page_instructions_w"></span><br/><span>Press <b>Q</b> to double split</span><br><span>Hold <b>W</b> to rapid fire mass</span><br><span>Press <b>M</b> to hide/show the minimap</span><br><span>Press <b>E</b> to split bots</span><br><span>Press <b>R</b> to eject some bots mass</span><br><span>Press <b>H</b> to hide/show the bot dialog</span><br><span>Â© <b>TrapKillo</b> Rights Reserved</span>'), a = replaceNormalFile(a, '<div id="tags-container">', '<div id="uuidbots" class="input-group" style="margin-top: 6px;"><span class="input-group-addon" style="width:75px"id="basic-addon1">UUID</span><input type="text" value="' + client_uuid + '" style="width:245px" readonly class="form-control"></div><div class="input-group" style="margin-top: 10px;"><span class="input-group-addon" style="width:75px" id="basic-addon1">NAMES</span><input id="botnames" class="form-control" style="width:245px" placeholder="Separate bot names using commas" autofocus=""></div><div id="tags-container">'), document.open("text/html", "replace"), document.write(a), document.close()
    }, e.send()
}, b.send(), setInterval(function() {
    Singa.realPlayerX = Singa.mapOffsetX + Singa.playerX, Singa.realPlayerY = Singa.mapOffsetY + Singa.playerY, moveBallOnMinimap("player_pointer", Singa.realPlayerX, Singa.realPlayerY), moveBallOnMinimap("player_spectate", Singa.realPlayerX, Singa.realPlayerY)
}, 50);
var last_transmited_game_server = null,
    socket = null;
interval_id = setInterval(function() {
    emitPosition(), transmit_current_server(!1)
}, 100);

function skinHack() {
    this.currentSkin = "";
    this.configUrlBase = window.EnvConfig.config_url + '/' + localStorage.getItem('last_config_id') + '/';
    this.configUrl = this.configUrlBase + 'GameConfiguration.json';
    this.skinObj = {};
    this.rotateInterval = 1000;
    this.playerName = '';
    this.canUseScript = false;
    this.downloadConfig();
}
skinHack.prototype = {
    downloadConfig: function() {
        var onDownload = this.onDownload.bind(this);
        $.ajax({
            type: "GET",
            url: this.configUrl,
            success: function(data) {
                onDownload(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {}
        });
    },
    onDownload: function(data) {
        this.handleSkinData(data);
        this.injectHtml();
        this.overrideSetNick();
        this.initSkinRotation();
        this.updateSkin();
    },
    handleSkinData: function(data) {
        var shopSkins = data.gameConfig['Shop - Skins'];
        var equippableSkins = data.gameConfig['Gameplay - Equippable Skins'];
        for (var i = 0; i < equippableSkins.length; i++) {
            var skin = equippableSkins[i];
            this.skinObj[skin.productId] = {
                image: skin.image,
                color: skin.cellColor
            };
        }
        for (var i = 0; i < shopSkins.length; i++) {
            var skin = shopSkins[i];
            this.skinObj[skin.productIdToQuantify].title = skin.title;
        }
    },
    injectHtml: function() {
        $('#advertisement').hide();
        $('.agario-promo').remove();
        $('.diep-cross').remove();
        $('#agario-web-incentive').remove();
        //$('<select id="skinsList" class="form-control" onchange="window.skinHack.updateSkin()" required=""></select><input type="checkbox" id="rotateSkinCheckBox">Rotate Skins</input>').insertBefore('#locationUnknown');
        $('<div class="agario-panel agario-side-panel"><img id="skinPreview" class="circle bordered"src=""width="96"height="96"style="height: 96px; border: 3px solid rgb(0, 44, 108);margin: 0 auto;"><br><select id="skinsList"class="form-control"onchange="window.skinHack.updateSkin()"required=""></select><br><div id="skinRotator"style="margin: auto"><label>Skin Rotator: </label><div style="left: 13px" class="btn-group btn-toggle"><button class="btn btn-sm active btn-default">ON</button><button class="btn btn-sm active btn-primary">OFF</button></div></div></div>').insertAfter('.agario-party');

        this.addSkinOption({
            image: '',
            color: '0x00000000',
            title: 'Default Skin'
        });
        for (var idStr in this.skinObj) {
            if (this.skinObj.hasOwnProperty(idStr) && this.skinObj[idStr].title) {
                this.addSkinOption(this.skinObj[idStr]);
            }
        }

        $('.btn-toggle').click(function() {
            $(this).find('.btn').toggleClass('active');

            if ($(this).find('.btn-primary').size() > 0) {
                $(this).find('.btn').toggleClass('btn-primary');
            }
            if ($(this).find('.btn-info').size() > 0) {
                $(this).find('.btn').toggleClass('btn-info');
            }

            $(this).find('.btn').toggleClass('btn-default');
        });
        this.preLoadSkins();
        $('#openfl-content').click(this.updateSkin.bind(this));
    },
    preLoadSkins: function() {
        for (var key in this.skinObj) {
            if (this.skinObj.hasOwnProperty(key)) {
                (new Image()).src = this.configUrlBase + this.skinObj[key].image;
            }
        }
    },
    addSkinOption: function(skin) {
		skin.title = skin.title.split("product_name_skin_")[1];
        $('#skinsList').append('<option value="' + skin.image + ':' + skin.color + '">' + skin.title + '</option>');
    },
    overrideSetNick: function() {
        window.MC._setNick = window.MC.setNick;
        window.MC.setNick = function() {
			var name = arguments[0];
			if(name === "") {
			  this.playerName = "u-Bot. ml"
			  name = "u-Bot. ml";
			  console.log('Overriding');
			} else {
			  this.playerName = name;
			}
            window.MC._setNick(name);
            
            this.updateSkin();
        }.bind(this);
    },
    checkSubscription: function() {
        try {
            if (localStorage.getItem('canUseScript')) {
                this.canUseScript = JSON.parse(localStorage.getItem('canUseScript').toLowerCase());
            } else {
                localStorage.setItem('canUseScript', 'false');
                return this.promptSubscription();
            }
            if (!this.canUseScript) {
                return this.promptSubscription();
            }
            return this.canUseScript;
        } catch (err) {
            console.log(err);
        }
    },
    promptSubscription: function() {
        var ask = window.confirm("You must subscribe to Agar File to <strong>use</strong> this Script");
        if (ask) {
            var win = window.open('https://www.youtube.com/channel/UCWGbmAErDv528JWyh2K0MJg?sub_confirmation=1', '_blank');
            if (win) {
                localStorage.setItem('canUseScript', 'true');
                this.canUseScript = true;
				this.updateSkin();
            } else {
                alert('Please allow popups and refresh the page first!');
            }
        }
        return this.canUseScript();
    },
    updateSkin: function() {
     
            var skinArg = $('#skinsList').val().split(':');
            var usingHackSkin = skinArg[0].length > 0;
            var image = usingHackSkin ? this.configUrlBase + skinArg[0] : document.getElementsByClassName('circle bordered')[0].src;
            var color = usingHackSkin ?
                parseInt(skinArg[1].slice(0, skinArg[1].length - 2)) :
            parseInt(this.rgbToHex(document.getElementsByClassName('circle bordered')[0].style.borderColor).slice(1, 7), 16);
            var name = this.playerName;
            window.core.registerSkin(name, null, image, image ? 2 : 0, image ? color : null);
            $('#skinPreview').attr('src', image)
            var arr = ['top', 'right', 'bottom', 'left'];
            for (var i = 0; i < array.length; i++) {
                $('#skinPreview').css('border-' + array[i] + '-color', '#' + color.toString(16));
            }
   
    },
    rgbToHex: function(color) {
        if (color.substr(0, 1) === '#') {
            return color;
        }
        var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

        var red = parseInt(digits[2]);
        var green = parseInt(digits[3]);
        var blue = parseInt(digits[4]);

        var rgb = blue | (green << 8) | (red << 16);
        return digits[1] + '#' + rgb.toString(16);
    },
    initSkinRotation: function() {
        setInterval(function() {
            if ($('.btn-toggle').find('.btn-primary').html() === "ON") {
                $('#skinsList')[0].selectedIndex = ($('#skinsList')[0].selectedIndex + 1) % $('#skinsList')[0].length;
                this.updateSkin();
            }
        }.bind(this), this.rotateInterval);
    }
};

import io.tekniq.config.TqEnvConfig
import io.tekniq.web.Rejection
import io.tekniq.web.Sparklin
import io.tekniq.web.SparklinConfig
import io.tekniq.web.SparklinStaticFiles
import org.slf4j.LoggerFactory

fun main(args: Array<String>) {
    val logger = LoggerFactory.getLogger("MainKt")

    val config = TqEnvConfig()
    val staticFiles: SparklinStaticFiles = if (config.get<String>("DEBUG") == "1") {
        println("DEBUG mode detected. Live reloading of UI resources")
        SparklinStaticFiles(externalFileLocation = "src/main/resources/ui")
    } else {
        SparklinStaticFiles(fileLocation = "/ui")
    }

    val sparklinConfig = SparklinConfig(
            staticFiles = staticFiles
    )

    Sparklin(sparklinConfig) {
        before { req, res ->
            res.type("application/json")
        }

        exception(NotFoundResource::class) { e, req, res ->
            Pair(404, mapOf("errors" to listOf(Rejection("notFound", "${req.requestMethod()} ${req.pathInfo()}"))))
        }

        /*
         router.get('/games', function(req, res) {
    Services.getActiveGames().then(function(games) {
      res.send(games);
    }).catch(errorHandler(res));
  });

  // POST /game {players: [{id: playerId, level: <label(s)>}]}
  router.post('/game', function(req, res) {
    Services.newGame(req.body).then(function(game) {
      res.send(game);
    }).catch(errorHandler(res));
  });

  // GET /game/1234
  router.get('/game/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    Services.getGame(gameId).then(function(game) {
      res.send(game);
    }).catch(errorHandler(res));
  });

  // DELETE /game/1234
  router.delete('/game/:gameId', function(req, res) {
    var gameId = req.params.gameId;
    Services.deleteGame(gameId).then(function(result) {
      console.info("Deleted game %s with result", gameId, result.result);
      res.send((result.result.n > 0));
    }).catch(errorHandler(res));
  });

  // GET /game/1234/player/abc
  // Return the words this player should be focusing on
  router.get('/game/:gameId/player/:playerId', function(req, res) {
    var gameId = req.params.gameId;
    var playerId = req.params.playerId;
  });

  // GET /players
  router.get('/players', function(req, res) {
    Services.getPlayers().then(function(players) {
      res.send(players);
    }).catch(errorHandler(res));
  });

  // GET /player/apple
  router.get('/player/:playerId', function(req, res) {
    Services.getPlayer(req.params.playerId).then(function(player) {
      res.send(player);
    }).catch(errorHandler(res));
  });
         */

        get("*") { req, resp ->
            if (reject("notFound", req.pathInfo()).rejections.size > 0) {
                throw NotFoundResource(req.requestMethod(), req.pathInfo(), req.params())
            }
        }
    }
}

class NotFoundResource(val method: String, val path: String, val params: Map<String, String> = emptyMap()) : Exception() {
}


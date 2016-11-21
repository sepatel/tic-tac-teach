import io.tekniq.ttt.AppConfig
import io.tekniq.ttt.AppDataSource
import io.tekniq.web.Rejection
import io.tekniq.web.Sparklin
import io.tekniq.web.SparklinConfig
import io.tekniq.web.SparklinStaticFiles
import org.hsqldb.server.Server
import org.slf4j.LoggerFactory

fun main(args: Array<String>) {
    val logger = LoggerFactory.getLogger("MainKt")

    if (AppConfig.get("enableDb", "1") == "1") {
        logger.info("Starting HSQL database ...")
        //val exists = File("db/ttt.properties").exists()
        val dbserver = Server().apply { // keep a handle in case we add shutdown hooks to cleanly turn off the server
            logWriter = null
            isTrace = false
            setDatabaseName(0, "ttt")
            setDatabasePath(0, "build/db")
            port = AppConfig.getInt("jdbcPort") ?: 9001 // default port
            start()
        }
    }

    logger.info("Initializing database ...")
    AppDataSource.initSchema()

    val staticFiles: SparklinStaticFiles = if (AppConfig.get<String>("DEBUG") == "1") {
        logger.debug("DEBUG mode detected. Live reloading of UI resources")
        SparklinStaticFiles(externalFileLocation = "src/main/resources/ui")
    } else {
        SparklinStaticFiles(fileLocation = "/ui")
    }

    Sparklin(SparklinConfig(staticFiles = staticFiles)) {
        before { req, res ->
            res.type("application/json")
        }

        exception(ResourceNotFound::class) { e, req, res ->
            Pair(404, mapOf("errors" to listOf(Rejection("notFound", "${req.requestMethod()} ${req.pathInfo()}"))))
        }

        get("*") { req, resp ->
            if (reject("notFound", req.pathInfo()).rejections.size > 0) {
                throw ResourceNotFound(req.requestMethod(), req.pathInfo(), req.params())
            }
        }
    }
}

class ResourceNotFound(val method: String, val path: String, val params: Map<String, String> = emptyMap()) : Exception() {
}


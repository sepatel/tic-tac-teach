package io.tekniq.ttt

import io.tekniq.config.TqChainConfig
import io.tekniq.config.TqEnvConfig
import io.tekniq.config.TqPropertiesConfig

object AppConfig : TqChainConfig(
        TqEnvConfig(),
        TqPropertiesConfig("config.properties", false)
        /*
        TqMapConfig(mapOf(
                "enableDb" to "1",
                "jdbcDriver" to "org.hsqldb.jdbcDriver",
                "jdbcUrl" to "jdbc:hsqldb:hsql://localhost/ttt",
                "jdbcPort" to 9001,
                "jdbcUser" to "sa",
                "jdbcPass" to ""
        ))
        */
)

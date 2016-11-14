package io.tekniq.ttt

import io.tekniq.jdbc.TqSingleConnectionDataSource
import io.tekniq.jdbc.insert
import io.tekniq.jdbc.selectOne
import io.tekniq.jdbc.transaction
import java.util.*

object AppDataSource : TqSingleConnectionDataSource(
        AppConfig.get<String>("jdbcUrl") ?: "jdbc:hsqldb:hsql://localhost/ttt",
        AppConfig.get<String>("jdbcUser") ?: "sa",
        AppConfig.get<String>("jdbcPass")
) {
    private val upgrades = listOf(
            "/app/01-schema-init.sql"
    )

    fun initSchema() {
        transaction {
            val stmt = createStatement()
            stmt.execute("CREATE TABLE IF NOT EXISTS config(version INT PRIMARY KEY, created TIMESTAMP)")

            val version = selectOne("SELECT max(version) FROM config") {
                getInt(1)
            } ?: 0

            upgrades.forEachIndexed { i, s ->
                if (version > i) {
                    return@forEachIndexed
                }

                var buffer = StringBuilder()
                AppDataSource.javaClass.getResourceAsStream(s).bufferedReader().forEachLine {
                    if (it.matches(".*;\\s*".toRegex())) {
                        buffer.append(it.substring(0, it.lastIndexOf(";")))
                        println("Invoking SQL: $buffer")
                        stmt.execute(buffer.toString())
                        buffer = StringBuilder()
                    } else {
                        buffer.append(it)
                    }
                }
                if (buffer.trim().length > 0) {
                    println("Invoking SQL: $buffer")
                    stmt.execute(buffer.toString())
                }

                insert("INSERT INTO config(version, created) VALUES(?, ?)", i + 1, Date())
            }
            stmt.close()

            commit()
        }
    }
}

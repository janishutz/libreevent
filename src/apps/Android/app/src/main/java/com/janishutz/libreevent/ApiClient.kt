package com.janishutz.libreevent

import java.io.BufferedReader
import java.io.DataOutputStream
import java.io.InputStreamReader
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.URL

class ApiClient {
    fun authenticateUser(apiUrl: String, username: String, password: String): String {
        try {
            val url = URL("$apiUrl/app/authenticate")
            println(url)
            val connection = url.openConnection() as HttpURLConnection

            // Set the request method to POST
            connection.requestMethod = "POST"

            // Set request headers (if needed)
            connection.setRequestProperty("Content-Type", "application/json")

            // Enable input and output streams for the connection
            connection.doInput = true
            connection.doOutput = true

            // Create the JSON request body
            val jsonRequest = "{\"email\":\"$username\",\"password\":\"$password\"}"

            // Write the JSON data to the output stream
            val outputStream = DataOutputStream(connection.outputStream)
            outputStream.write(jsonRequest.toByteArray(Charsets.UTF_8))
            outputStream.flush()
            outputStream.close()

            // Get the response code from the server
            val responseCode = connection.responseCode

            if (responseCode == HttpURLConnection.HTTP_OK) {
                // Read and handle the response from the server
                val reader = BufferedReader(InputStreamReader(connection.inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()

                // Return the response as a String
                return response.toString()
            } else {
                println(responseCode)
                return "status-code-non-ok"
            }
        } catch (e: Exception) {
            e.printStackTrace()
            return "error"
        }
    }

    fun checkTicket(apiUrl: String, username: String, password: String, ticket: String): String {
        var url = URL("$apiUrl/app/ticketLookup")
        if ( !apiUrl.contains( "https://" )) {
            url = URL("https://$apiUrl/app/ticketLookup")
        }

        val connection = url.openConnection() as HttpURLConnection

        // Set the request method to POST
        connection.requestMethod = "POST"

        // Set request headers (if needed)
        connection.setRequestProperty("Content-Type", "application/json")

        // Enable input and output streams for the connection
        connection.doInput = true
        connection.doOutput = true

        // Create the JSON request body
        val jsonRequest = "{\"email\":\"$username\",\"password\":\"$password\",\"ticketID\":\"$ticket\"}"

        // Write the JSON data to the output stream
        val outputStream = DataOutputStream(connection.outputStream)
        outputStream.write(jsonRequest.toByteArray(Charsets.UTF_8))
        outputStream.flush()
        outputStream.close()

        // Get the response code from the server
        val responseCode = connection.responseCode

        if (responseCode == HttpURLConnection.HTTP_OK) {
            // Read and handle the response from the server
            val reader = BufferedReader(InputStreamReader(connection.inputStream))
            val response = StringBuilder()
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                response.append(line)
            }
            reader.close()

            // Return the response as a String
            return response.toString()
        } else {
            val r = BufferedReader(InputStreamReader(connection.errorStream))
            val res = StringBuilder()
            var line: String?
            while (r.readLine().also { line = it } != null) {
                res.append(line)
            }
            r.close()
            println(res.toString())

            return "Error"
        }
    }
}
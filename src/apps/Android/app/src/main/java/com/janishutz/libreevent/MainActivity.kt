package com.janishutz.libreevent

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.os.StrictMode
import android.os.StrictMode.ThreadPolicy
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity


class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val policy = ThreadPolicy.Builder().permitAll().build()
        StrictMode.setThreadPolicy(policy)

        val sharedPref = applicationContext.getSharedPreferences( "login", MODE_PRIVATE )

        val hasSwitched = intent.hasExtra("hasSwitched")

        val loginButton = findViewById<Button>(R.id.loginButton)
        val urlEditText = findViewById<EditText>(R.id.url)
        val usernameEditText = findViewById<EditText>(R.id.username)
        val passwordEditText = findViewById<EditText>(R.id.password)

        if (sharedPref.getString( "url", null ).toString() != "null" && sharedPref.getString( "username", null ).toString() != "null" ) {
            urlEditText.setText(sharedPref.getString( "url", null ).toString())
            usernameEditText.setText(sharedPref.getString( "username", null ).toString())
        }

        if (sharedPref.getString( "loginOk", null ).toString() != "null" && !hasSwitched) {
            println(sharedPref.getString( "loginOk", null ).toString())
            val switchIntent = Intent(this, ScannerActivity::class.java)
            startActivity(switchIntent)
        }

        loginButton.setOnClickListener {
            val url = urlEditText.text.toString()
            val username = usernameEditText.text.toString()
            val password = passwordEditText.text.toString()
            login( url, username, password )
        }
    }

    private fun login( url: String, username: String, password: String ) {
        val res = ApiClient().authenticateUser( url, username, password )
        println( res )
        if ( res == "authOk" ) {
            val sharedPref = applicationContext.getSharedPreferences( "login", MODE_PRIVATE )
            val editor = sharedPref.edit()
            editor.putString( "username", username )
            editor.putString( "password", password )
            editor.putString( "url", url )
            editor.putString( "loginOk", "true" )
            editor.apply()
            val switchIntent = Intent(this, ScannerActivity::class.java)
            startActivity(switchIntent)
        } else if ( res == "status-code-non-ok" ) {
            val alertDialogBuilder = AlertDialog.Builder(this)
            alertDialogBuilder.setTitle("Username or password incorrect")
            alertDialogBuilder.setMessage("Please ensure that the values entered are correct and try again")
            alertDialogBuilder.setIcon(android.R.drawable.ic_dialog_alert)

            alertDialogBuilder.setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            alertDialogBuilder.show()
        } else if ( res == "error") {
            val alertDialogBuilder = AlertDialog.Builder(this)
            alertDialogBuilder.setTitle("Unable to connect")
            alertDialogBuilder.setMessage("Please ensure that the url specified is correct.")
            alertDialogBuilder.setIcon(android.R.drawable.ic_dialog_alert)

            alertDialogBuilder.setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            alertDialogBuilder.show()
        } else if ( res == "wrong") {
            val alertDialogBuilder = AlertDialog.Builder(this)
            alertDialogBuilder.setTitle("Username or password incorrect")
            alertDialogBuilder.setMessage("Please ensure that the values entered are correct and try again")
            alertDialogBuilder.setIcon(android.R.drawable.ic_dialog_alert)

            alertDialogBuilder.setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            alertDialogBuilder.show()
        }
    }
}
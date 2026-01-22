package com.janishutz.libreevent

import android.Manifest
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import androidx.core.app.ActivityCompat
import com.journeyapps.barcodescanner.BarcodeCallback
import com.journeyapps.barcodescanner.BarcodeResult
import com.journeyapps.barcodescanner.CaptureActivity
import com.journeyapps.barcodescanner.CaptureManager
import com.journeyapps.barcodescanner.DecoratedBarcodeView
import java.util.Date
import androidx.core.content.edit

class ScannerActivity : CaptureActivity() {

    private lateinit var barcodeView: DecoratedBarcodeView
    private lateinit var captureManager: CaptureManager

    private var lastScanned: String = ""
    private var lastScanTimestamp: Long = 0
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scanner)

        barcodeView = findViewById(R.id.barcodeScannerView)

        val logoutButton = findViewById<Button>(R.id.logoutButton)
        logoutButton.setOnClickListener {
            val sharedPref = applicationContext.getSharedPreferences( "login", MODE_PRIVATE )
            sharedPref.edit {
                remove("password")
                remove("loginOk")
            }
            val switchIntent = Intent(this, MainActivity::class.java)
            switchIntent.putExtra("hasSwitched", true)
            startActivity(switchIntent)
        }

        // Check for camera permission and request if not granted
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CAMERA), CAMERA_PERMISSION_REQUEST)
        } else {
            setupScanner()
        }
    }

    private fun setupScanner() {
        captureManager = CaptureManager(this, barcodeView)

        captureManager.initializeFromIntent(intent, null)
        captureManager.decode()
        barcodeView.decodeContinuous { result ->
            if (result != null) {
                val scannedData = result.text // This is the scanned data (e.g., QR code content)
                handleScanResult(scannedData)
            }
        }
    }

    private fun handleScanResult(result: String) {
        if ( lastScanned != result || lastScanTimestamp + 2000 < System.currentTimeMillis()) {
            lastScanTimestamp = System.currentTimeMillis()
            val sharedPref = applicationContext.getSharedPreferences( "login", MODE_PRIVATE )

            val status = ApiClient().checkTicket( sharedPref.getString( "url", null ).toString(),
                sharedPref.getString( "username", null ).toString(),
                sharedPref.getString( "password", null ).toString(), result )
            lastScanned = result
            val alertDialogBuilder = AlertDialog.Builder(this)

            when (status) {
                "ticketValid" -> {
                    alertDialogBuilder.setTitle("Ticket is valid")
                }
                "ticketInvalid" -> {
                    alertDialogBuilder.setTitle("Ticket is invalid")
                }
                "Error" -> {
                    alertDialogBuilder.setTitle("There was an error connecting")
                    alertDialogBuilder.setMessage("Please log out and log in again")
                }
            }

            alertDialogBuilder.setIcon(android.R.drawable.ic_dialog_alert)

            alertDialogBuilder.setPositiveButton("OK") { dialog, _ ->
                dialog.dismiss()
            }
            alertDialogBuilder.show()
        }
    }

    override fun onResume() {
        super.onResume()
        captureManager.onResume()
    }

    override fun onPause() {
        super.onPause()
        captureManager.onPause()
    }

    // Pass savedInstanceState to onSaveInstanceState
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        captureManager.onSaveInstanceState(outState)
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                setupScanner()
            } else {
                val alertDialogBuilder = AlertDialog.Builder(this)
                alertDialogBuilder.setTitle("Camera access required!")
                alertDialogBuilder.setMessage("Please ensure that camera access is enabled in settings")
                alertDialogBuilder.setIcon(android.R.drawable.ic_dialog_alert)

                alertDialogBuilder.setPositiveButton("OK") { dialog, _ ->
                    dialog.dismiss()
                }
                alertDialogBuilder.show()
            }
        }
    }

    companion object {
        private const val CAMERA_PERMISSION_REQUEST = 1
    }
}
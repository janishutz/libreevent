package com.janishutz.libreevent

import android.Manifest
import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import androidx.core.app.ActivityCompat
import com.journeyapps.barcodescanner.BarcodeCallback
import com.journeyapps.barcodescanner.BarcodeResult
import com.journeyapps.barcodescanner.CaptureActivity
import com.journeyapps.barcodescanner.CaptureManager
import com.journeyapps.barcodescanner.DecoratedBarcodeView

class ScannerActivity : CaptureActivity() {

    private lateinit var barcodeView: DecoratedBarcodeView
    private lateinit var captureManager: CaptureManager

    private var lastScanned: String = ""
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scanner)

        barcodeView = findViewById(R.id.barcodeScannerView)

        val logoutButton = findViewById<Button>(R.id.logoutButton)
        logoutButton.setOnClickListener {
            val sharedPref = getPreferences( MODE_PRIVATE )
            val editor = sharedPref.edit()
            editor.remove( "loginOk" )
            editor.remove( "username" )
            editor.remove( "url" )
            editor.apply()
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
        barcodeView.decodeContinuous(object : BarcodeCallback {
            override fun barcodeResult(result: BarcodeResult?) {
                if (result != null) {
                    val scannedData = result.text // This is the scanned data (e.g., QR code content)
                    handleScanResult(scannedData)
                }
            }
        })
    }

    private fun handleScanResult(result: String) {
        if ( lastScanned != result ) {
            println(result)
            val sharedPref = getPreferences( MODE_PRIVATE )

            ApiClient().checkTicket( sharedPref.getString( "url", null ).toString(),
                sharedPref.getString( "username", null ).toString(),
                sharedPref.getString( "password", null ).toString(), result )
            lastScanned = result
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
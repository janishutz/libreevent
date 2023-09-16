package com.janishutz.libreevent

import android.Manifest
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.app.ActivityCompat
import com.journeyapps.barcodescanner.CaptureManager
import com.journeyapps.barcodescanner.DecoratedBarcodeView

class ScanActivity : AppCompatActivity() {

    private lateinit var barcodeView: DecoratedBarcodeView
    private lateinit var captureManager: CaptureManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scanner)

        barcodeView = findViewById(R.id.barcodeScannerView)

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
                // Handle permission denied
            }
        }
    }

    companion object {
        private const val CAMERA_PERMISSION_REQUEST = 1
    }
}
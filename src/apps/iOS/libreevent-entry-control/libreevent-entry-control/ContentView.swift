//
//  ContentView.swift
//  libreevent-entry-control
//
//  Created by Janis Hutz on 08.08.23.
//

import SwiftUI
import CodeScanner
import AVFoundation

struct ContentView: View {
    @State var isShowingLoginSheet = !UserDefaults.standard.bool(forKey: "auth")
    @State var isShowingTicketValid = false
    @State var isShowingError = false
    @State var isShowingTicketInvalid = false
    @State var isShowingCredentialsWrong = false
    @State var username = ""
    @State var instance = ""
    @State var scanResult = ""
    var body: some View {
        NavigationStack {
            Text(String.localizedStringWithFormat(NSLocalizedString("connectionDetails", value: "You are connected to %@ as %@", comment: "This shows connection details for the "), instance, username)).padding().font(.footnote).italic()
            CodeScannerView(codeTypes: [.qr], scanMode: .continuous, simulatedData: "dsgkgjkdsagjdksagdklsadgakjs_dgf", shouldVibrateOnSuccess: true, completion: handleScanAdd).navigationTitle(NSLocalizedString("app.name", value: "libreevent", comment: "Title of the app"))
                .toolbar {
                    Button {
                        UserDefaults.standard.set(false, forKey: "auth")
                        isShowingLoginSheet = true
                    } label: {
                        Text(NSLocalizedString("toobar.logout", value: "Log out", comment: "Logout button in toolbar on main screen"))
                    }
                }.onAppear {
                    username = UserDefaults.standard.string(forKey: "email") ?? ""
                    instance = UserDefaults.standard.string(forKey: "url") ?? ""
                }.onChange(of: isShowingLoginSheet) { newValue in
                    if newValue == false {
                        print("reloading")
                        username = UserDefaults.standard.string(forKey: "email") ?? ""
                        instance = UserDefaults.standard.string(forKey: "url") ?? ""
                    }
                }
        }.sheet(isPresented: $isShowingLoginSheet) {
            LoginView(isShowingLoginSheet: $isShowingLoginSheet).interactiveDismissDisabled(true)
        }.alert(NSLocalizedString("lookup.error", value: "An unknown error occurred whilst looking up data. Please try again!", comment: "Tells the user that lookup of data did not succeed"), isPresented: $isShowingError) {
            Button {
                isShowingError = false
            } label: {
                Text("Ok")
            }
        }.alert(NSLocalizedString("lookup.invalid", value: "Ticket is INVALID!", comment: "Tells the user that the ticket scanned is not valid"), isPresented: $isShowingTicketInvalid) {
            Button {
                isShowingTicketInvalid = false
            } label: {
                Text("Ok")
            }
        }.alert(NSLocalizedString("lookup.valid", value: "Ticket is VALID!", comment: "Tells the user that the ticket scanned is valid"), isPresented: $isShowingTicketValid) {
            Button {
                isShowingTicketValid = false
            } label: {
                Text("Ok")
            }
        }.alert(NSLocalizedString("lookup.credWrong", value: "Authentication credentials are incorrect! Please reauthenticate!", comment: "Tells the user that the authentication credentials are not valid"), isPresented: $isShowingCredentialsWrong) {
            Button {
                isShowingCredentialsWrong = false
            } label: {
                Text("Ok")
            }
        }
    }
    func handleScanAdd(result: Result<ScanResult, ScanError>) {
        switch result {
        case.success(let result):
            var req = URLRequest(url: URL(string: UserDefaults.standard.string(forKey: "url")! + "/app/ticketLookup")!)
            req.httpMethod = "POST"
            let body = ["email": UserDefaults.standard.string(forKey: "email")!,
                        "password": UserDefaults.standard.string(forKey: "password")!,
                        "ticketID": result.string]
            let bodyData = try? JSONSerialization.data(
                withJSONObject: body,
                options: []
            )
            req.httpBody = bodyData
            req.setValue("application/json", forHTTPHeaderField: "Content-Type")
            let task = URLSession.shared.dataTask(with: req) { data, res, err in
                if err != nil {
                    isShowingError = true
                }
                
                if let data = data, let dataString = String(data: data, encoding: .utf8) {
                    if dataString == "ticketInvalid" {
                        isShowingTicketInvalid = true
                    } else if dataString == "wrong" {
                        isShowingCredentialsWrong = true
                    } else {
                        isShowingTicketValid = true
                    }
                } else {
                    isShowingTicketInvalid = false
                }
            }
            task.resume()
        case.failure(let error):
            print(error.localizedDescription)
        }
    }
}

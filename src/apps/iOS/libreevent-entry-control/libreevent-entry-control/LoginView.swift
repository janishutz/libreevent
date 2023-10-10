//
//  LoginView.swift
//  libreevent-entry-control
//
//  Created by Janis Hutz on 07.09.23.
//

import SwiftUI

struct LoginView: View {
    @State var url: String = UserDefaults.standard.string(forKey: "url") ?? ""
    @State var username: String = UserDefaults.standard.string(forKey: "email") ?? ""
    @State var password: String = ""
    @State var isShowingAuthError: Bool = false
    @Binding var isShowingLoginSheet: Bool
    @State var isShowingIncorrect: Bool = false
    @State var isLogginIn = false
    var body: some View {
        NavigationStack {
            Spacer()
            VStack {
                Text(NSLocalizedString("home.title", value: "Welcome to libreevent!", comment: "Title for login page")).font(.largeTitle).bold()
                Spacer().frame(height: 50)
                Text("Please enter the libreevent server URL, the username and password of that user in the corresponding fields below to log in")
                TextField(NSLocalizedString("url", value: "libreevent server url", comment: "The field where the user is supposed to enter the libreevent server url."), text: $url).keyboardType(.URL)
                TextField(NSLocalizedString("username", value: "Username", comment: "The username entry field on login screen"), text: $username).keyboardType(.emailAddress)
                SecureField(NSLocalizedString("password", value: "Password", comment: "The password entry field on login screen"), text: $password)
                Button {
                    connect()
                } label: {
                    Text("Sign in")
                }
                if isLogginIn {
                    Text("Logging in...").padding()
                }
            }
            Spacer()
            Text(NSLocalizedString("home.explanation", value: "libreevent entry control requires a operational libreevent server instance. Click the link below for more info", comment: "")).font(.footnote).foregroundColor(.gray).italic()
            Link(destination: URL(string: "https://libreevent.janishutz.com")!) {
                Text("libreevent website").font(.footnote).italic()
            }
            Spacer().frame(height: 30).alert(NSLocalizedString("auth.error", value: "Could not authenticate! Please check that URL is correct.", comment: "Tells the user that authentication did not succeed"), isPresented: $isShowingAuthError) {
                Button {
                    isShowingAuthError = false
                } label: {
                    Text("Ok")
                }
            }.alert(NSLocalizedString("auth.incorrect", value: "Some values are incorrect!", comment: "Tells the user that authentication did not succeed"), isPresented: $isShowingIncorrect) {
                Button {
                    isShowingIncorrect = false
                } label: {
                    Text("Ok")
                }
            }
        }.padding()
    }
    
    func connect() {
        isLogginIn = true
        var req = URLRequest(url: URL(string: $url.wrappedValue + "/app/authenticate")!)
        req.httpMethod = "POST"
        let body = ["email": $username.wrappedValue, "password": $password.wrappedValue]
        let bodyData = try? JSONSerialization.data(
            withJSONObject: body,
            options: []
        )
        req.httpBody = bodyData
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let task = URLSession.shared.dataTask(with: req) { data, res, err in
            if err != nil {
                isShowingAuthError = true
            }
            
            if let data = data, let dataString = String(data: data, encoding: .utf8) {
                print(dataString)
                if dataString == "authOk" {
                    UserDefaults.standard.set(true, forKey: "auth")
                    UserDefaults.standard.set($username.wrappedValue, forKey: "email")
                    UserDefaults.standard.set($password.wrappedValue, forKey: "password")
                    UserDefaults.standard.set($url.wrappedValue, forKey: "url")
                    isShowingLoginSheet = false
                    isLogginIn = false
                } else {
                    isShowingIncorrect = true
                    isLogginIn = false
                }
            } else {
                isShowingIncorrect = true
                isLogginIn = false
            }
        }
        task.resume()
    }
}

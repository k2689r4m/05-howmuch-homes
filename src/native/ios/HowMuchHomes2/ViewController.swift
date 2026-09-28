//
//  ViewController.swift
//  HowMuchHomes2
//
//  Created by 송경진 on 2021/11/17.
//

import UIKit
import WebKit

class ViewController: UIViewController, WKUIDelegate, WKNavigationDelegate, WKScriptMessageHandler {
    var url: String = "https://hmhomes.kr/home"
//    var url: String = "https://plushdev.com/home"
    
    //var webView: WKWebView!
//    var popupWebView: WKWebView?
    
    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var subWebView: WKWebView?
    
    override func loadView() {
        super.loadView()
//        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 1, execute: self.test)
        
        //let contentController: WKUserContentController = WKUserContentController()
        //let config: WKWebViewConfiguration = WKWebViewConfiguration()
        
        //contentController.add(self, name: "IOS")
        //config.userContentController = contentController
        
        //super.view.backgroundColor = UIColor(red: 15, green: 123, blue: 255, alpha: 1.0)
        
        //UIApplication.shared.statusBarStyle = UIColor(red: 15, green: 123, blue: 255, alpha: 1.0)
        
        webView = WKWebView(
            frame: self.view.frame
        )
        webView.uiDelegate = self
        webView.navigationDelegate = self
        let contentController = webView.configuration.userContentController
        contentController.add(self, name: "IOS")
        contentController.add(self, name: "postKey")
        contentController.add(self, name: "getKey")
        //let userScript = WKUserScript(source: "alert('etst)", injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        //contentController.addUserScript(userScript)
        //webView.configuration.userContentController = contentController
        //self.view.addSubview(self.webView)
        self.view = self.webView
        
    }
    
//    func test () {
//
//    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        //self.view.backgroundColor = UIColor(red: 15, green: 123, blue: 255, alpha: 1.0)-
        // Do any additional setup after loading the view.
        let url = URL(string: self.url)
        let request = URLRequest(url: url!)
        self.webView?.allowsBackForwardNavigationGestures = true //뒤로가기 제스처 활성화
        webView.configuration.preferences.javaScriptEnabled = true //자바 스크립트 활성화
        
        webView.load(request)
//        UIApplication.shared.statusBarView?.backgroundColor = UIColor(red: 15, green: 123, blue: 255, alpha: 1.0)
    }
    
    func urlSchemeCheck (_id: String, _method: String) {
        self.url = "https://hmhomes.kr/home?id=\(_id)&method=\(_method)"
//        self.url = "https://plushdev.com/home?id=\(_id)&method=\(_method)"
        
//        self.showAlert(title: "[sheme info]", content: "id: \(_id), method: \(_method)", okBtn: "confirm", noBtn: "")
    }
    
    func showAlert(title: String, content: String, okBtn: String, noBtn: String) {
        let alert = UIAlertController(title: title, message: content, preferredStyle: UIAlertController.Style.alert)
        
        if (okBtn != "" && okBtn.count > 0) {
            let okAction = UIAlertAction(title: okBtn, style: .default) {
                (action) in
                return
            }
            alert.addAction(okAction)
        }
        if (noBtn != "" && noBtn.count > 0) {
            let noAction = UIAlertAction(title: noBtn, style: .default) {
                (action) in
                return
            }
            alert.addAction(noAction)
        }
        
        present(alert, animated: false, completion: nil)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning() //모달 창 닫힐 때 앱 종료 방지
    }
    
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        print(navigationAction.request.url?.absoluteString ?? "")

        // 카카오 SDK가 호출하는 커스텀 URL 스킴인 경우 open(_ url:) 메서드를 호출합니다.
        if let url = navigationAction.request.url , ["kakaolink"].contains(url.scheme) {

            // 카카오톡 실행 가능 여부 확인 후 실행
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
            }

            decisionHandler(.cancel)
            
            return
        }

        // 서비스에 필요한 나머지 로직을 구현합니다.
        decisionHandler(.allow)
    }
    
    //@available(iOS 8.0, *)
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage){
        if(message.name == "IOS"){
            guard let body = message.body as? [String: Any] else { return }
            //guard let title = body["title"] as? String else { return }
            //guard let content = body["content"] as? String else { return }
            guard let id = body["id"] as? String else { return }

            //alertMessageBox(title: title, content: content)
            //webView.evaluateJavaScript("alert('test')", completionHandler: nil)
            //webView.evaluateJavaScript("alert('\(UIDevice.current.identifierForVendor!.uuidString)')", completionHandler: nil)
            
            webView.evaluateJavaScript("onMessageReceive('\(id)', true, '\(UIDevice.current.identifierForVendor!.uuidString)')", completionHandler: nil)
            //webView.evaluateJavaScript("seon.ztest('test123213')", completionHandler: nil)
        }
        else if (message.name == "postKey") {
            guard let body = message.body as? [String: Any] else { return }
            guard let key = body["key"] as? String else { return }
            //guard let id = body["id"] as? String else { return }
            
            //postKey(key: key, id: id)
            postKey(key: key, id: "")
        }
        else if (message.name == "getKey") {
            guard let body = message.body as? [String: Any] else { return }
            guard let id = body["id"] as? String else { return }
            
            getKey(id: id)
        }
    }
    
    func alertMessageBox(title: String, content: String) {
        let alert = UIAlertController(title: title, message: content, preferredStyle: UIAlertController.Style.alert)
        
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        
        self.present(alert, animated: true, completion: nil)
    }
    
    func postKey(key: String, id: String) {
        let customPlist = "homeskey.plist"
            
        /// .plist는 sandbox내에 존재, sandbox에는 디렉토리 전용 및 파일 전용이 따로 존재
        /// 첫 번째 인수 : 디렉토리 전용, 두 번째 인수 : 애플리케이션 범위, 세 번째 인수 : 전체 경로(true)인지 디렉토리명만(false)인지
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
        
        let path = paths[0] as NSString
        let plist = path.strings(byAppendingPaths: [customPlist]).first!
        let data = NSMutableDictionary(contentsOfFile: plist) ?? NSMutableDictionary()
            
        data.setValue(key, forKey: "key")
        
        data.write(toFile: plist as String, atomically: true)
        
        //webView.evaluateJavaScript("alert('\(key)')", completionHandler: nil)
        //webView.evaluateJavaScript("onMessageReceive('\(id)', true, undefined)", completionHandler: nil)
    }
    
    func getKey(id: String) {
        let customPlist = "homeskey.plist"
        
        let paths = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)
        let path = paths[0] as NSString
        let plist = path.strings(byAppendingPaths: [customPlist]).first!
        let data = NSDictionary(contentsOfFile: plist)
       
        let key = data?["key"] as? String
        
        if key != nil {
            //webView.evaluateJavaScript("alert('\(key!)')", completionHandler: nil)
            webView.evaluateJavaScript("onMessageReceive('\(id)', true, '\(key!)')", completionHandler: nil)
        }
        else {
            //webView.evaluateJavaScript("alert(undefined)", completionHandler: nil)
            webView.evaluateJavaScript("onMessageReceive('\(id)', true, '')", completionHandler: nil)
        }
    }
    
    //alert 처리
    func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        let alertController = UIAlertController(title: "", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "확인", style: .default, handler: { (action) in completionHandler() }))
        self.present(alertController, animated: true, completion: nil)
    }
    
    //confirm 처리
    func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        let alertController = UIAlertController(title: "", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "취소", style: .default, handler: { (action) in completionHandler(false) }))
        alertController.addAction(UIAlertAction(title: "확인", style: .default, handler: { (action) in completionHandler(true) }))
        self.present(alertController, animated: true, completion: nil)
    }
    
    @objc func handleSwipes(_ sender:UISwipeGestureRecognizer) {
        if (sender.direction == .right) {
            if (sender.location(in: self.subWebView).x < 20) {
                self.subWebView?.removeFromSuperview()
                self.subWebView = nil
                self.webView.allowsBackForwardNavigationGestures = true
            }
        }
    }

    //href = "_blank" 처리
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame == nil {
            let createWebView = WKWebView(frame: self.webView.bounds, configuration: configuration)

            createWebView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

            createWebView.navigationDelegate = self
            createWebView.uiDelegate = self
            createWebView.tag = 100
            createWebView.allowsBackForwardNavigationGestures = true
            
            let rightSwipeGestureRecognizer = UISwipeGestureRecognizer(target: self, action: #selector(handleSwipes(_:)))
                    
            rightSwipeGestureRecognizer.direction = .right

            createWebView.addGestureRecognizer(rightSwipeGestureRecognizer)
//            createWebView.allowsBackForwardNavigationGestures = true
            
            
            self.webView.addSubview(createWebView)
            self.subWebView = createWebView
            self.webView.allowsBackForwardNavigationGestures = false

            return createWebView
            
//            webView.frame = view.bounds
//            self.webView.addSubview(webView)
//            webView.load(navigationAction.request)
        }
        
//        popupWebView = WKWebView(frame: view.bounds, configuration: configuration)
//        popupWebView!.autoresizingMask = [.flexibleWidth, .flexibleHeight]
//        popupWebView!.navigationDelegate = self
//        popupWebView!.uiDelegate = self
//        view.addSubview(popupWebView!)
//        return popupWebView!
        
        return nil
    }
    
//    func webViewDidClose(_ webView: WKWebView) {
//        webView.removeFromSuperview()
//        popupWebView = nil
//    }
//
//    open func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
//        UIApplication.shared.isNetworkActivityIndicatorVisible = true
//    }
//
//    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
//        UIApplication.shared.isNetworkActivityIndicatorVisible = false
//    }
}

//extension UIApplication {
//    var statusBarView: UIView? {
//        if responds(to: Selector("statusBar")) {
//            return value(forKey: "statusBar") as? UIView
//        }
//        return nil
//    }
//}

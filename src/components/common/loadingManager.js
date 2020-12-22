export class LoadingManager {

    static get loadingScreen(){
        return document.querySelector("#loadingScreen")
    }

    static showLoading(){
        console.log({
            "LoadingManager.loadingScreen": LoadingManager.loadingScreen
        });
        if(LoadingManager.loadingScreen){
            LoadingManager.loadingScreen.classList.remove("hidden")
        }
    }

    static hideLoading(){
        if(LoadingManager.loadingScreen){
            LoadingManager.loadingScreen.classList.add("hidden")
        }
    }
}
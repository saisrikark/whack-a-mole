// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn result(_row: i32, _column: i32, element: i32) -> i32 {
    element
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![result])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

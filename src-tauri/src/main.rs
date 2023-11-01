// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn result(row: i32, column: i32, element: i32) -> i32 {
    println!("row {} column {} element {}", row, column, element);
    1
}

#[tauri::command]
fn grid(rows: usize, columns: usize) -> Vec<Vec<i32>> {
    let matrix = vec![vec![0; columns]; rows*columns];
    matrix
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![result, grid])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

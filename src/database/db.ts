import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseSync('app.db');

export function run(sql: string, params: any[] = []) {
  return db.runSync(sql, params);
}

export function getFirst<T>(sql: string, params: any[] = []) {
  return db.getFirstSync<T>(sql, params);
}

export function getAll<T>(sql: string, params: any[] = []) {
  return db.getAllSync<T>(sql, params);
}

export function exec(sql: string) {
  return db.execSync(sql);
}
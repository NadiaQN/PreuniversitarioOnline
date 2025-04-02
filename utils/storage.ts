import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Guarda un valor en AsyncStorage
 * @param key Clave bajo la cual se almacenará el valor
 * @param value Valor a almacenar (cualquier tipo de dato serializable)
 */
export async function saveToStorage(key: string, value: any) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error("Error al guardar en AsyncStorage:", error);
  }
}

/**
 * Obtiene un valor de AsyncStorage
 * @param key Clave del valor a recuperar
 * @returns El valor almacenado o `null` si no existe
 */
export async function getFromStorage<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error al recuperar datos de AsyncStorage:", error);
    return null;
  }
}

/**
 * Elimina un valor de AsyncStorage
 * @param key Clave del valor a eliminar
 */
export async function removeFromStorage(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error("Error al eliminar datos de AsyncStorage:", error);
  }
}

export async function getUserFromStorage() {
  const userData = await AsyncStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

package com.meta64.mobile.util;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;

public class FileTools {

	public static boolean fileExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isFile();
	}

	public static boolean dirExists(String fileName) {
		if (fileName == null || fileName.equals("")) return false;

		return new File(fileName).isDirectory();
	}

	public static boolean createDirectory(String dir) {
		File file = new File(dir);
		if (file.isDirectory()) return true;
		boolean success = file.mkdirs();
		return success;
	}

	public static void writeEntireFile(String fileName, String content) throws Exception {
		BufferedWriter out = new BufferedWriter(new FileWriter(fileName));
		try {
			out.write(content);
			out.flush();
		}
		finally {
			if (out != null) {
				out.close();
			}
		}
	}

	public static String ensureValidFileNameChars(String text) {
		if (text == null) return null;

		int length = text.length();
		StringBuilder ret = new StringBuilder();
		char c;

		for (int i = 0; i < length; i++) {
			c = text.charAt(i);

			if (Character.isLetter(c) || Character.isDigit(c) || c == '.' || c == ' ' || c == '-' || c == '_') {
				ret.append(c);
			}
			else {
				ret.append('-');
			}
		}

		return ret.toString();
	}
}

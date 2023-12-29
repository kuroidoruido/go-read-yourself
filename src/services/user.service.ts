import { addDays, isAfter, endOfToday } from "date-fns";
import nodeCrypto from "node:crypto";
import { mkdtempSync, rmdirSync, statSync } from "node:fs";
import nodePath from "node:path";
import { tmpdir } from "node:os";
import { readFileSync } from "node:fs";
import { ConfigService } from "./config.service";

const USERS_PATH = "./data/users.json";

const COOKIE_TOKEN_NAME = "GoReadYourself__auth";
const COOKIE_TOKEN_DIR_PREFIX = `${COOKIE_TOKEN_NAME}__`;

class UserServiceImpl {
  getUsers(): AppUsers {
    return JSON.parse(readFileSync(USERS_PATH, { encoding: "utf-8" }));
  }

  authenticate(
    email: Email,
    password: string,
    setCookie: (name: string, value: string, expires: Date) => void
  ) {
    try {
      const hash = nodeCrypto
        .createHmac("sha256", password + ConfigService.getConfig().user.salt)
        .digest("hex");
      console.log("hashed password that will be checked", hash);
      if (this.getUsers()[email]?.password === hash) {
        const tmpDir = tmpdir();
        const tokenDir = mkdtempSync(
          nodePath.join(tmpDir, COOKIE_TOKEN_DIR_PREFIX)
        );
        const token = tokenDir.slice(tokenDir.lastIndexOf("/") + 1);
        setCookie(COOKIE_TOKEN_NAME, token, addDays(endOfToday(), 30));
        return true;
      } else {
        console.debug("password does not match");
      }
      return false;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  isConnectedAsAdmin(getCookie: (name: string) => string | undefined) {
    try {
      const token = getCookie(COOKIE_TOKEN_NAME);
      const tmpDir = tmpdir();
      const tokenDir = nodePath.join(tmpDir, token ?? "__invalid");
      if (tokenDir.endsWith("__invalid")) {
        return false;
      }

      const tokenDirStat = statSync(tokenDir);
      if (
        tokenDirStat &&
        isAfter(tokenDirStat.ctime, addDays(endOfToday(), -31))
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  logOut(
    getCookie: (name: string) => string | undefined,
    removeCookie: (name: string) => void
  ) {
    const token = getCookie(COOKIE_TOKEN_NAME);
    const tmpDir = tmpdir();
    const tokenDir = nodePath.join(tmpDir, token ?? "__invalid");
    try {
      rmdirSync(tokenDir);
    } finally {
      removeCookie(COOKIE_TOKEN_NAME);
    }
    return true;
  }
}

export const UserService = new UserServiceImpl();

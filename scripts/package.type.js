import NTFile from "ntfile";

NTFile.exec("npx tsc -p ./scripts/tsconfig.json");
NTFile.copy("./build/type/InputDetect.d.ts", "./build/cjs/InputDetect.min.d.ts");
NTFile.copy("./build/type/InputDetect.d.ts", "./build/umd/InputDetect.min.d.ts");
NTFile.copy("./build/type/InputDetect.d.ts", "./build/esm/InputDetect.min.d.ts");

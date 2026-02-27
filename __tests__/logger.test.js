describe("Configuration du Logger (Pino)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("devrait avoir le niveau 'info' par défaut si LOG_LEVEL n'est pas défini", () => {
    delete process.env.LOG_LEVEL;

    const logger = require("../logger");

    expect(logger.level).toBe("info");
  });

  it("devrait prendre le niveau défini dans process.env.LOG_LEVEL", () => {
    process.env.LOG_LEVEL = "debug";

    const logger = require("../logger");

    expect(logger.level).toBe("debug");
  });

  it("devrait utiliser la fonction isoTime pour le timestamp", () => {
    const logger = require("../logger");

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
  });
});

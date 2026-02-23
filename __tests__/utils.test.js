const { toArray, formatTodo, formatTodos } = require("../routes/utils");

describe("Unit Tests: Utils (Strict validation)", () => {
  describe("toArray", () => {
    test("doit retourner un tableau vide si rows est vide", () => {
      expect(toArray([])).toEqual([]);
    });

    test("doit retourner un tableau vide si rows est null", () => {
      expect(toArray(null)).toEqual([]);
    });

    test("doit mapper les colonnes et les valeurs sql.js correctement", () => {
      const input = [
        {
          columns: ["id", "title", "status"],
          values: [
            [1, "Test 1", "pending"],
            [2, "Test 2", "done"],
          ],
        },
      ];
      const expected = [
        { id: 1, title: "Test 1", status: "pending" },
        { id: 2, title: "Test 2", status: "done" },
      ];
      expect(toArray(input)).toEqual(expected);
    });
  });

  describe("formatTodo", () => {
    test("doit extraire uniquement id, title, description et status", () => {
      const input = {
        id: 99,
        title: "T",
        description: "D",
        status: "S",
        extra: "should_be_removed",
        completed: 1,
      };
      const result = formatTodo(input);

      expect(result.id).toBe(99);
      expect(result.title).toBe("T");
      expect(result.description).toBe("D");
      expect(result.status).toBe("S");

      expect(result.extra).toBeUndefined();
      expect(result.completed).toBeUndefined();
    });
  });

  describe("formatTodos", () => {
    test("doit formater une liste de plusieurs todos", () => {
      const input = [
        { id: 1, title: "A", description: "DA", status: "SA" },
        { id: 2, title: "B", description: "DB", status: "SB" },
      ];
      const output = formatTodos(input);

      expect(output).toHaveLength(2);
      expect(output[0].id).toBe(1);
      expect(output[1].title).toBe("B");
    });

    test("doit gérer un tableau vide", () => {
      expect(formatTodos([])).toEqual([]);
    });
  });
});

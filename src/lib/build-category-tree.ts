import { KakaoCategoryDto } from "@/types/message";

interface Option {
  value: string;
  label: string;
  children?: Option[];
}

export function buildTree(data: KakaoCategoryDto) {
  const tree: Option[] = [];

  const options = data.categories.map((category) => ({
    value: category.code,
    labels: category.name.split(","),
  }));

  options.forEach((item) => {
    const [level1, level2, level3] = item.labels;

    let level1Node = tree.find((node) => node.label === level1);
    if (!level1Node) {
      level1Node = {
        value: item.value.slice(0, 3),
        label: level1,
        children: [],
      };
      tree.push(level1Node);
    }

    let level2Node = level1Node.children?.find((node) => node.label === level2);
    if (!level2Node) {
      level2Node = {
        value: level2,
        label: level2,
        children: [],
      };
      level1Node.children?.push(level2Node);
    }

    level2Node.children?.push({ value: item.value, label: level3 });
  });

  return tree;
}

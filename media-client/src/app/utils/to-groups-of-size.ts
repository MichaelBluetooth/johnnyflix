export function toGroupsOfSizeTyped<T>(items: any[], groupSize: number): T[] {
    const size = 4;
    const groups = [];

    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }

    return groups;
}

export function toGroupsOfSize(items: any[], groupSize: number): any[] {
    const size = 4;
    const groups = [];

    for (let i = 0; i < items.length; i += size) {
        groups.push(items.slice(i, i + size));
    }

    return groups;
}
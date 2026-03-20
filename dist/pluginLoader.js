export async function loadPlugins(server, context) {
    const plugins = [
        (await import("./plugins/mirrorPlugin.js")).default,
        (await import("./plugins/notificationsPlugin.js")).default,
        (await import("./plugins/homeAssistantPlugin.js")).default,
        (await import("./plugins/systemPlugin.js")).default
    ];
    for (const plugin of plugins) {
        await plugin.register(server, context);
    }
}

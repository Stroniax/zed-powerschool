use tower_lsp::{
    LanguageServer, LspService, Server,
    jsonrpc::{Error, Result},
    lsp_types::{
        Hover, HoverContents, HoverParams, HoverProviderCapability, InitializeParams,
        InitializeResult, MarkedString, ServerCapabilities, ServerInfo,
    },
};

#[tokio::main]
async fn main() {
    let stdin = tokio::io::stdin();
    let stdout = tokio::io::stdout();

    let (service, socket) = LspService::new(PshtmlLanguageServer::new);

    Server::new(stdin, stdout, socket).serve(service).await;
}

struct PshtmlLanguageServer;

impl PshtmlLanguageServer {
    pub fn new<T>(_: T) -> Self {
        Self
    }
}

#[tower_lsp::async_trait]
impl LanguageServer for PshtmlLanguageServer {
    async fn initialize(&self, params: InitializeParams) -> Result<InitializeResult> {
        let res = InitializeResult {
            capabilities: ServerCapabilities {
                hover_provider: Some(HoverProviderCapability::Simple(true)),
                ..Default::default()
            },
            server_info: Some(ServerInfo {
                name: "PowerSchool HTML".into(),
                version: Some("0.0.1".into()),
            }),
        };

        Ok(res)
    }

    async fn shutdown(&self) -> Result<()> {
        todo!()
    }

    /// The [`textDocument/hover`] request asks the server for hover information at a given text
    /// document position.
    ///
    /// [`textDocument/hover`]: https://microsoft.github.io/language-server-protocol/specification#textDocument_hover
    ///
    /// Such hover information typically includes type signature information and inline
    /// documentation for the symbol at the given text document position.
    async fn hover(&self, params: HoverParams) -> Result<Option<Hover>> {
        let _ = params;
        Ok(Some(Hover {
            range: None,
            contents: HoverContents::Scalar(MarkedString::String(
                r"
                # Work In Progress

                Language server is a WIP. Nothing is implemented here.
                "
                .into(),
            )),
        }))
    }
}

#[cfg(test)]
mod test {
    use crate::PshtmlLanguageServer;
    use tower::Service;
    use tower_lsp::{
        LspService,
        jsonrpc::Request,
        lsp_types::{InitializeParams, InitializeResult},
    };

    #[tokio::test]
    async fn has_hover_capabilities() {
        let (mut service, _client) = LspService::new(PshtmlLanguageServer::new);
        let init_params = serde_json::to_value(InitializeParams::default()).unwrap();
        let request = Request::build("initialize")
            .id(1)
            .params(init_params)
            .finish();

        let response = service.call(request).await.unwrap().unwrap();

        let result: InitializeResult =
            serde_json::from_value(response.result().unwrap().to_owned()).unwrap();
        assert!(result.capabilities.hover_provider.is_some());
    }
}

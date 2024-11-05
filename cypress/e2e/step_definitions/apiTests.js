import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { apiCalls } from "@pages/ApiTestsPage";

let responseBody;

When(
  "Sistem mesajları apisine tüm mesajları almak için istek yolluyorum",
  () => {
    const url = `${apiCalls.baseUrl}${apiCalls.message_controller.return_all_messages.endpoint}`;
    cy.request({
      method: "GET",
      url: url,
      headers: {
        Authorization: apiCalls.default_bearer,
        "x-auth-config": apiCalls.default_x_auth_config,
      },
    }).then((res) => {
      responseBody = res.body;
      cy.log("Respons body: " + JSON.stringify(responseBody));
    });
  }
);

Then("Success durumu {string} dönmeli", (successDurumu) => {
  expect(String(responseBody.success)).to.equal(successDurumu);
});

When("Sistem mesajları apisine mesaj kaydetmek için istek yolluyorum", () => {
  const url = `${apiCalls.baseUrl}${apiCalls.message_controller.save_message.endpoint}`;
  cy.request({
    method: "POST",
    url: url,
    headers: {
      Authorization: apiCalls.default_bearer,
      "x-auth-config": apiCalls.default_x_auth_config,
    },
    body: apiCalls.message_controller.save_message.body,
    failOnStatusCode: false,
  }).then((res) => {
    responseBody = res.body;
    // cy.log("Respons body: " + JSON.stringify(responseBody))
  });
});

Then("{string} response içinde görünmeli", (metin) => {
  expect(JSON.stringify(responseBody)).to.include(metin);
});

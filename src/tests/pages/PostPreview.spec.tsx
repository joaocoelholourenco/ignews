import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createMock } from "ts-jest-mock";

import Post, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismicio";

const content = [
  {
    type: "paragraph",
    text: "Post excerpt",
    spans: [
      {
        start: 0,
        end: 23,
        type: "strong",
      },
      {
        start: 480,
        end: 538,
        type: "strong",
      },
      {
        start: 549,
        end: 562,
        type: "strong",
      },
      {
        start: 549,
        end: 562,
        type: "hyperlink",
        data: {
          link_type: "Web",
          url: "https://www.ofuxico.com.br/famosos/rodrigo-mussi/",
          target: "_blank",
        },
      },
      {
        start: 643,
        end: 667,
        type: "hyperlink",
        data: {
          link_type: "Web",
          url: "https://www.ofuxico.com.br/reality-show/bbb/ex-bbb-rodrigo-mussi-sofre-acidente-de-carro-em-sao-paulo/",
          target: "_blank",
        },
      },
    ],
  },
];
const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: content,
  updatedAt: "March, 10",
};
jest.mock("../../services/prismicio");
jest.mock("next/router");
jest.mock("next-auth/react");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = createMock(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<Post post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = createMock(useSession);
    const useRouterMocked = createMock(useRouter);
    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: null,
      },
      status: "authenticated",
    });

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("load initial data", async () => {
    const getPrismicClientMocked = createMock(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: "My New Post",
          content: [
            {
              type: "paragraph",
              text: "Post excerpt",
            },
          ],
        },
        last_publication_date: "04-01-2022",
      }),
    } as any);

    const response = await getStaticProps({ params: { slug: "my-new-post" } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My New Post",
            content: [
              {
                type: "paragraph",
                text: "Post excerpt",
              },
            ],
            updatedAt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});

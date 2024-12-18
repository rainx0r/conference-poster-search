# conference-poster-search
Since conferences like NeurIPS unironically have 750 posters per session now (???), whilst attending NeurIPS 2024 I thought I'd make a browser extension such that I can easily search through them.

This extension injects a search box into the page of any Poster Session and it will search through the list of posters for relevant ones using an LLM.

## Status
The extension does work with the OpenAI API and Gemini. The extension works on Safari. It can be installed through Xcode. That's about it. The extension should also work on Firefox but the repository doesn't have the structure for it to be easily installable on it right now.

### Roadmap
- [x] Basic MVP for Safari using LLM search

(Sometime before ICLR 2025...)
- [ ] Make a fancy icon for it and come up with a proper name
- [ ] Add support for Chrome
- [ ] Publish on Firefox / Chrome / Safari
- [ ] Add non-LLM search (RAG / more traditional retrieval methods)

## (mini-blogpost) Why search by prompting an LLM? And does it even work?
Well, the idea was that you could basically describe your research interests to an LLM and then it'll go out and find all the cool posters for you. I have pretty broad interests that are often explored amongst a variety of fields (0-shot / ood generalisation, world models, RL, planning, multi-task models, TTA etc) and I kinda just want to search for all of them at once. So CTRL+F doesn't work, and if I were to implement more traditional information retrieval, I'd have to structure my query in a specific way to really get results for multiple interests like that. Also, I had a feeling that RAG wouldn't really work either as there wouldn't be good matches against my entire query, just parts of it.

So since I'd ideally need some assistant to take in my request, process it and find cool posters for me to go to, I thought, "why not just 'feel the AGI' and just ask an LLM to do this?"

Sadly though it turns out that searching purely with an LLM and no other retrieval methods doesn't actually work that well even if everything fits in-context. I mostly used Gemini 2.0 Flash (which came out during NeurIPS 2024 and everyone was hyping up ~~and  also had a free API at the time~~) and it didn't actually get every paper that's relevant for the poster sessions I tested it on. It also didn't get the same posters every time I searched so it wasn't very deterministic either.

In the end I ended up just scaling my poster session attendance method to the 750 posters at the event and went through everything myself in person. But maybe I can beef up the search in this extension to the point that precision and recall are good.
